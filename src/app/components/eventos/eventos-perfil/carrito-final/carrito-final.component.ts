import { ConfigSeguro } from '../../../../models/configSeguro.model';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BaseComponent } from '../../../../common-ui/base.component';
import { OrdenDataService } from '../../../../service/data/orden-data.service';
import { EventoDataService } from '../../../../service/data/evento-data.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../service/seguridad/auth.service';
import { PtpDataService } from '../../../../service/data/ptp-data.service';
import { Evento } from '../../../../models/evento.model';
import { Ticket } from '../../../../models/ticket.model';
import { Localidad } from '../../../../models/localidad.model';
import { ConfirmacionComponent } from '../confirmacion/confirmacion.component';
import { CountdownModule } from 'ngx-countdown';
import localeES from '@angular/common/locales/es';
import { Orden } from '../../../../models/orden.model';
import { Dia } from '../../../../models/dia.model';
import { HoraPipe } from '../../../../pipes/horas.pipe';

@Component({
  selector: 'app-carrito-final',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CountdownModule,
    HoraPipe
  ],
  templateUrl: './carrito-final.component.html',
  styleUrl: './carrito-final.component.scss'
})
export class CarritoFinalComponent extends BaseComponent {

  orden: Orden = new Orden()
  evento: Evento = new Evento()
  dia: Dia | null = null
  tickets: Ticket[] = []
  localidad: Localidad | null = null
  configSeguro: ConfigSeguro | null = null
  pagar: boolean = false
  mostrarSeguro: boolean = false
  valorSeguro: number = 0
  seguro: boolean = false
  aporteAlcancia: number = 0
  aporteMinimo: number = 0
  cuponAgregado: boolean = false
  cuponCodigo: string = ''
  adicionales: any[] = []
  totalPrecioTickets: number = 0
  valorTotalEstable: number = 0
  
  override pathVariableName = 'idOrden';

  constructor(
    private service: OrdenDataService,
    private eventoService: EventoDataService,
    private router: Router,
    private ptpService: PtpDataService,
    private authService: AuthService,
    dialog: MatDialog,
    route: ActivatedRoute
  ){
    super(dialog, route);
  }

  override cargarDatos(): void {
    if (!this.pathVariable) {
      this.mostrarError("ID de orden no válido");
      return;
    }

    this.iniciarCarga();
    this.service.getInformacionCarritoDeCompras(this.pathVariable).subscribe({
      next: (response) => {
        if (response) {
          this.handleResponse(response);
        } else {
          this.mostrarError("No tienes ninguna orden de compra pendiente");
        }
        this.finalizarCarga();
      },
      error: (err) => {
        this.manejarError(err, "Sucedio un error por favor vuelva a intentar");
      }
    });
  }

  handleResponse(response: any): void {
    this.orden = response.orden;

    if (this.orden.estado !== 3) {
      this.mostrarError("No tienes ninguna orden de compra pendiente");
      this.router.navigate(['/home']);
      return;
    }

    this.tickets = response.tickets;
    this.evento = response.evento;  // Cambio: evento sin 's'
    this.localidad = response.localidad;
    this.configSeguro = response.configSeguro || null;

    // Cargar el evento completo usando getEventoVenta para obtener los días e imágenes
    if (this.evento && this.evento.id) {
      this.eventoService.getEventoVenta(this.evento.id.toString()).subscribe({
        next: (response) => {
          const eventoCompleto = response.evento;
          // Mantener los datos básicos del evento del carrito pero agregar días e imágenes
          this.evento = { ...this.evento, ...eventoCompleto };
          // Si tiene días, tomar el primer día para fechaFin y horaFin
          if (eventoCompleto.dias && eventoCompleto.dias.length > 0) {
            this.dia = eventoCompleto.dias[0];
          }
        },
        error: (error) => {
          console.error('Error al cargar evento completo:', error);
        }
      });
    }

    // Verificar si la orden ya tiene seguro obligatorio
    if (this.orden.valorSeguro && this.orden.valorSeguro > 0) {
      this.seguro = true;
      this.valorSeguro = this.orden.valorSeguro;
      this.mostrarSeguro = true;
    }

    // Para alcancías (orden tipo 3), calcular aporte mínimo multiplicado por cantidad de tickets
    if (this.orden.tipo === 3) { // Alcancía
      this.aporteMinimo = this.localidad.aporteMinimo * this.tickets.length;
      this.aporteAlcancia = this.aporteMinimo;
    }

    // Solo calcular seguro opcional si no es obligatorio
    if (this.configSeguro && this.configSeguro.valorMaximo > 0 && 
        this.orden.valorOrden <= this.configSeguro.valorMaximo && 
        this.orden.tipo !== 3) {
      this.mostrarSeguro = true;
      this.valorSeguro = Math.ceil(this.orden.valorOrden * (this.configSeguro.porcentaje / 100) / 100) * 100;
    }

    // Calcular el precio total de los tickets
    this.totalPrecioTickets = this.calcularTotalTickets();
  }

  ptp(): void {
    if (this.pagar) return;
    
    // Validar aporte mínimo para alcancías
    if (this.orden?.tipo === 3) {
      if (this.aporteAlcancia < this.aporteMinimo) {
        this.mostrarError(`El aporte mínimo es ${this.aporteMinimo.toLocaleString('es-CO', {style: 'currency', currency: 'COP'})}`);
        return;
      }
    }
    
    this.iniciarCarga();
    this.pagar = true;
    
    const aporteParaEnviar = this.orden?.tipo === 3 ? this.aporteAlcancia : undefined;
    
    this.authService.guardarSesionEnLocalStorage();
    this.ptpService.getPeticionPTP(this.orden.id, this.seguro, aporteParaEnviar).subscribe({
      next: response => {
        window.location.href = response.processUrl;
      },
      error: error => {
        this.pagar = false;
        this.manejarError(error, "Sucedio un error por favor vuelva a intentar");
      }
    });
  }

  openConfirmacion(mensaje: string): void {
    if (!this.seguro && this.mostrarSeguro && this.orden.tipo !== 4) {
      const dialogRef = this.dialog.open(ConfirmacionComponent, {
        data: { mensaje: mensaje }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.cambiarEstadoSeguro();
        }
        this.ptp();
      });
    } else {
      this.ptp();
    }
  }

  cambiarEstadoSeguro(): void {
      this.seguro = !this.seguro;
  
  }

  darFecha(evento: Evento): string {

    if(evento.fechaApertura==null){
      return 'Por confirmar'
    }

    registerLocaleData(localeES, 'es');
    let dataPipe: DatePipe = new DatePipe('es');
    let Word = dataPipe.transform(evento.fechaApertura, 'EEE dd');
    Word = Word[0].toUpperCase() + Word.substr(1).toLowerCase();

    let Word2 = dataPipe.transform(evento.fechaApertura, 'MMM');
    Word2 = Word2[0].toUpperCase() + Word2.substr(1).toLowerCase();


    let fecha = Word + " de " + Word2 + " de " + dataPipe.transform(evento.fechaApertura, 'yyyy');

    return fecha
  }

  darURL() {
    if (!this.evento?.imagenes) {
      return "";
    }
    const primeraImagenTipo1 = this.evento.imagenes.find(imagen => imagen.tipo === 1);
    var urlPrimeraImagenTipo1 = "";
    if (primeraImagenTipo1) {
      urlPrimeraImagenTipo1 = primeraImagenTipo1.url;
    }
    return urlPrimeraImagenTipo1
  }

  private calcularTotalTickets(): number {
    if (this.orden?.tipo === 3) {
      // Para alcancías, usar el aporte
      return this.aporteAlcancia;
    }
    // Para órdenes normales, calcular basado en tickets y tarifas
    let total = 0;
    const tarifa = this.localidad?.tarifa;
    if (tarifa) {
      const precioUnitario = tarifa.precio + tarifa.servicio + tarifa.iva;
      total = precioUnitario * this.tickets.length;
    }
  
    return total;
  }

  get valorTotal(): number {
    const totalTickets = this.calcularTotalTickets();
    return this.seguro ? totalTickets + this.valorSeguro : totalTickets;
  }

  validarAporte(): void {
    if (this.aporteAlcancia < this.aporteMinimo) {
      this.aporteAlcancia = this.aporteMinimo;
    }
  }

  validarCupon(): void {
  if (!this.cuponCodigo.trim()) {
    this.mostrarError("Debes ingresar un código de cupón");
    return;
  }

  this.iniciarCarga();
  this.service.aplicarCupon(this.cuponCodigo, this.orden.id).subscribe({
    next: (response) => {
      this.cuponAgregado = true;
      this.mostrarMensaje(response.mensaje || "Cupón aplicado correctamente");
      this.finalizarCarga();
    },
    error: (err) => {
      this.manejarError(err, "No se pudo aplicar el cupón");
    }
  });
}

  agregarAdicion(adicion: any): void {
    // Implementar lógica para agregar adicionales
  }

  adicionSeleccionado(adicion: any): boolean {
    // Implementar lógica para verificar si el adicional está seleccionado
    return false;
  }

  formatoNumero(): void {
    // Implementar formateo de número
  }
}