import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import localeES from '@angular/common/locales/es';
import { Ticket } from '../../../../models/ticket.model';
import { Evento } from '../../evento.model';
import { OrdenDataService } from '../../../../service/data/orden-data.service';
import { PtpDataService } from '../../../../service/data/ptp-data.service';
import { MensajeComponent } from '../../../mensaje/mensaje.component';
import { ConfirmacionComponent } from '../confirmacion/confirmacion.component';
import { Localidad } from '../../../../models/localidad.model';
import { Orden } from '../../../../models/orden.model';
import { CuponDataService } from '../../../../service/data/cupon-data.service';
import { Cupon } from '../../../../models/cupon.model';
import { AdicionalesDataService } from '../../../../service/data/adicionales-data.service';
import { Adicionales } from '../../../../models/adicionales.model';
import { AuthService } from '../../../../service/seguridad/auth.service';
import { HoraPipe } from '../../../../pipes/horas.pipe';

@Component({
  selector: 'app-carrito-final',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    HoraPipe
  ],
  templateUrl: './carrito-final.component.html',
  styleUrl: './carrito-final.component.scss'
})
export class CarritoFinalComponent implements OnInit {
  idOrden: string
  evento: Evento
  tickets: Ticket[]
  pagar: boolean
  valorTotal: number
  localidad: Localidad
  description: string
  tax: number
  valorTotalEstable: number
  orden: Orden
  cuponCodigo: string
  cupon: Cupon
  adicionales: Adicionales[]
  adicionalesSeleccionados: Adicionales[]
  cargando: boolean;
  mostrarSeguro: boolean
  servicios: Adicionales[]
  valorSeguro: number
  seguro: boolean
  cuponAgregado: Cupon;

  constructor(
    private service: OrdenDataService,
    private route: ActivatedRoute,
    private router: Router,
    private ptpService: PtpDataService,
    private dialog: MatDialog,
    private servicioCupon: CuponDataService,
    private servicioAdicionales: AdicionalesDataService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.valorSeguro = 0
    this.mostrarSeguro = false
    this.seguro = false
    this.valorTotal = 0
    this.valorTotalEstable = 0
    this.tax = 0
    this.evento = new Evento()
    this.pagar = false
    this.localidad = new Localidad();
    this.tickets = []
    this.adicionales = []
    this.adicionalesSeleccionados = []
    this.orden = new Orden();
    this.cargando = true;

    this.route.paramMap.subscribe(params => {
      this.idOrden = params.get('idOrden')
      this.service.getInformacionCarritoDeCompras(this.idOrden).subscribe(response => {
        if(response){
          this.handleResponse(response);
          this.cargando = false;
        }else{
          this.cargando = false;
          this.openMensaje("No tienes ninguna orden de compra pendiente")
        }
      })
    })
  }

  handleResponse(response: any) {
    this.orden = response.orden

    if(this.orden.estado != 3){
      this.orden = null
      this.cargando = false
      this.openMensaje("No tienes ninguna orden de compra pendiente")
      this.router.navigate(['/home'])
    }else{
      this.tickets = response.tickets
      this.evento = response.evento
      this.localidad = response.localidad
      this.adicionales = response.servicios
      this.cuponAgregado = response.cupon
    }

    if(this.adicionales.length > 0){
      this.adicionales.forEach(a => {
        this.adicionalesSeleccionados.push(a)
      })
    }

    if (this.tickets.length > 0) {
      for (let i = 0; i < this.tickets.length; i++) {
        let ticket = this.tickets[i]
        this.valorTotal += ticket.precio + ticket.servicio + ticket.servicio_iva + this.totalAdicionales()
        this.valorTotalEstable += ticket.precio + ticket.servicio + ticket.servicio_iva
        this.tax = ticket.servicio_iva
      }
    }

    this.servicioAdicionales.getAllAdicionalesDeLocalidad(this.tickets[0].localidadId).subscribe(response => {
      this.adicionales = response.lista
    })
    this.description = this.tickets.length + ' Tickets para ' +
      this.evento.nombre +
      ' En la localidad ' + this.localidad.nombre;
    this.cargando = false

    if (this.valorTotal <= 3000000 && this.orden.tipo != 4) {
      this.mostrarSeguro = true
      this.valorSeguro = Math.ceil(this.valorTotal * 0.043 / 100) * 100;
    }

    if(this.cuponAgregado){
      this.calcularDescuentoCupon(response.cupon);
    }
    this.valorTotal += this.orden.seguro
    if(this.orden.seguro > 0){
      this.seguro = true
      this.valorSeguro = this.orden.seguro
    }
  }

  darFecha(evento: Evento): string {
    if(evento.fecha == null){
      return 'Por confirmar'
    }

    registerLocaleData(localeES, 'es');
    let dataPipe: DatePipe = new DatePipe('es');
    let Word = dataPipe.transform(evento.fecha, 'EEE dd');
    Word = Word[0].toUpperCase() + Word.substr(1).toLowerCase();

    let Word2 = dataPipe.transform(evento.fecha, 'MMM');
    Word2 = Word2[0].toUpperCase() + Word2.substr(1).toLowerCase();

    let fecha = Word + " de " + Word2 + " de " + dataPipe.transform(evento.fecha, 'yyyy');

    return fecha
  }

  darURL() {
    const primeraImagenTipo1 = this.evento.imagenes.find(imagen => imagen.tipo === 1);
    var urlPrimeraImagenTipo1 = "";
    if (primeraImagenTipo1) {
      urlPrimeraImagenTipo1 = primeraImagenTipo1.url;
    }
    return urlPrimeraImagenTipo1
  }

  ptp() {
    if (this.pagar == false) {
      this.cargando = true;
      this.pagar = true;
      let valorSeguroFinal = 0;
      if(this.seguro) {
        valorSeguroFinal = this.valorSeguro;
      }

      if(this.orden.tipo == 4 && this.valorTotal < this.valorTotalEstable * 0.2){
        this.openMensaje("El valor a pagar es inferior al valor mínimo para tu alcancía")
        this.pagar = false;
        this.cargando = false;
        return;
      }

      this.authService.guardarSesionEnLocalStorage();

      this.ptpService.getPeticionPTP(this.idOrden, this.valorTotal, this.description, this.tax, valorSeguroFinal).subscribe({
        next: response => {
          window.location.href = response.processUrl;
        },
        error: error => {
          this.openMensaje("Sucedio un error por favor vuleva a intentar");
          this.pagar = false;
          this.cargando = false;
        }
      });
    }
  }

  get totalPrecioTickets(): number {
    if (!this.tickets) return 0;
    return this.tickets.reduce(
      (total, ticket) => total + ticket.precio + ticket.servicio + ticket.servicio_iva,
      0
    );
  }

  openMensaje(mensajeT: string, openD?: string): void {
    let screenWidth = screen.width;
    let anchoDialog: string = '500px';
    let anchomax: string = '80vw';
    let altoDialog: string = '250';
    if (screenWidth <= 600) {
      anchoDialog = '100%';
      anchomax = '100%';
      altoDialog = 'auto';
    }
    const dialogRef = this.dialog.open(MensajeComponent, {
      width: anchoDialog,
      maxWidth: anchomax,
      height: altoDialog,
      data: {
        mensaje: mensajeT
      }
    });
  }

  openConfirmacion(mensaje: string): void {
    if ( this.valorTotal >= this.valorTotalEstable * 0.2) {
      if(!this.seguro && this.orden.tipo != 4){
        const dialogRef = this.dialog.open(ConfirmacionComponent, {
          data: { mensaje: mensaje }
        });

        dialogRef.afterClosed().subscribe((result => {
          if (result) {
            this.cambiarEstadoSeguro()
          }
          this.ptp();
          this.cargando = true
        }))
      }
      else{
        this.ptp()
      }
    }
    else if (this.valorTotal > this.valorTotalEstable) {
      this.openMensaje("El valor a pagar es superior al valor total de la alcancia")
    }
    else if (this.valorTotal < this.valorTotalEstable * 0.2) {
      this.openMensaje("El valor a pagar es inferior al valor mínimo para tu alcancia")
    }
  }

  formatoNumero() {
    this.valorTotal = parseFloat(this.valorTotal.toString().replace(/[^0-9.]/g, ''));
  }

  validarCupon() {
    this.servicioCupon.validarCupon(this.cuponCodigo, this.tickets[0].localidadId, this.tickets.length).subscribe(
      {
        next: response => {
          this.manejarCupon(response)
        },
        error: error => {
          this.openMensaje('No se encuentra para esta localidad un cupon con el codigo ' + this.cuponCodigo);
        }
      }
    )
  }

  manejarCupon(response: any) {
    if (response.mensaje) {
      this.openMensaje(response.mensaje);
    } else {
      this.cupon = response.cupon

      this.service.crearOrdenCupon(this.idOrden, this.cupon.codigoVenta).subscribe({
        next: response => {
          this.calcularDescuentoCupon(this.cupon);
          this.cuponAgregado = this.cupon
          this.openMensaje('Se aplico tu cupón ' + this.cuponCodigo);
        }, error: error => {

        }
      })
    }
  }

  cambiarEstadoSeguro() {
    this.seguro = !this.seguro

    if (this.seguro) {
      this.valorTotal += this.valorSeguro
    }
    else {
      this.valorTotal -= this.valorSeguro
    }
  }

  agregarAdicion(adicion: Adicionales) {
    this.service.crearOrdenAdicional(this.idOrden, adicion).subscribe({
      next: response => {
        this.tickets.forEach(t => {
          t.precio += adicion.precio
          t.servicio += adicion.servicio
          t.servicio_iva += adicion.servicioIva
          this.valorTotal += adicion.precio + adicion.servicio + adicion.servicioIva
        })

        this.adicionalesSeleccionados.push(adicion)
        this.localidad.nombre += ` + ${adicion.nombre}`
        this.openMensaje("Agregado el servicio")

        this.valorSeguro = Math.ceil(this.valorTotal * 0.043 / 100) * 100;
        if (this.seguro) {
          this.valorTotal += this.valorSeguro
        }
      }, error: error => {
        this.openMensaje("Sucedio un error por favor vuelva a intentarlo")
      }
    })
  }

  adicionSeleccionado(adicion: Adicionales): boolean {
    return this.adicionalesSeleccionados.some(seleccionado => seleccionado.id === adicion.id);
  }

  totalAdicionales(): number {
    return this.adicionalesSeleccionados.reduce((total, adicional) => {
        return total + adicional.precio + adicional.servicio + adicional.servicioIva;
    }, 0);
  }

  calcularDescuentoCupon(cupon: Cupon){
    this.valorTotal = 0

    for (let i = 0; i < this.tickets.length; i++) {
      if(this.tickets[i].precio > 0){
        this.tickets[i].precio = cupon.precio
        this.tickets[i].servicio = cupon.servicio
        this.tickets[i].servicio_iva = cupon.iva
      }
      this.valorTotal = this.valorTotal + this.tickets[i].precio + this.tickets[i].servicio + this.tickets[i].servicio_iva
    }
    
    this.adicionalesSeleccionados.forEach(a => {
      this.tickets.forEach(t => {
        this.valorTotal += a.precio + a.servicio + a.servicioIva
        t.precio += a.precio
        t.servicio += a.servicio
        t.servicio_iva += a.servicioIva
      })
    })

    this.valorSeguro = Math.ceil(this.valorTotal * 0.043 / 100) * 100;
    if (this.seguro) {
      this.valorTotal += this.valorSeguro
    }
  }
}