import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import localeES from '@angular/common/locales/es';

import { Evento } from '../../../models/evento.model';
import { Localidad } from '../../../models/localidad.model';
import { ClientePagos } from '../../../models/cliente-pagos.model';
import { EventoDataService } from '../../../service/data/evento-data.service';
import { OrdenDataService } from '../../../service/data/orden-data.service';
import { ClientesPagoDataService } from '../../../service/data/clientes-pago-data.service';
import { AuthService } from '../../../service/seguridad/auth.service';
import { BaseComponent } from '../../../common-ui/base.component';
import { HoraPipe } from '../../../pipes/horas.pipe';
import { HardcodedAutheticationService } from '../../../service/hardcoded-authetication.service';
import { SeleccionLocalidadComponent } from './seleccion-localidad/seleccion-localidad.component';

@Component({
  selector: 'app-eventos-perfil',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HoraPipe,
    SeleccionLocalidadComponent
  ],
  templateUrl: './eventos-perfil.component.html',
  styleUrl: './eventos-perfil.component.scss'
})
export class EventosPerfilComponent extends BaseComponent {
  evento: Evento = new Evento();
  localidades: Localidad[] = [];
  mapaUrl: any;
  safeSrc: any = null;
  fecha: Date = new Date();
  fechaActual: Date = new Date();
  meses: number = 0;
  semanas: number = 0;
  dias: number = 0;
  horas: number = 0;
  minutos: number = 0;
  segundos: number = 0;
  cantidadTotal: number = 0;
  cantidades: number[] = [];
  idLocalidad: any;
  cliente: ClientePagos;
  usuario: string = '';
  valorTotal: number = 0;
  localidadSeleccionadaId: number | null = null;
  idPromotor: string | null = null;
  
  override pathVariableName = 'id';

  constructor(
    private service: EventoDataService,
    private sanitizer: DomSanitizer,
    private ordenService: OrdenDataService,
    private router: Router,
    private authService: AuthService,
    private hardCodedAuthService: HardcodedAutheticationService,
    private clienteDataService: ClientesPagoDataService,
    dialog: MatDialog,
    route: ActivatedRoute
  ) {
    super(dialog, route);
  }

  override cargarDatos(): void {
    if (!this.pathVariable) {
      this.mostrarError("ID de evento no válido");
      return;
    }

    // Capturar el parámetro idPromotor si existe
    this.route.paramMap.subscribe(params => {
      this.idPromotor = params.get('idPromotor');
      console.log('ID Promotor:', this.idPromotor);
    });

    this.iniciarCarga();
    this.cantidades = [];
    this.valorTotal = 0;
    this.cantidadTotal = 0;

    this.service.getEventoVenta(this.pathVariable).subscribe({
      next: (response) => {
        if (response) {
          this.handleGetSuccesfull(response);
        } else {
          this.mostrarError("No se puede mostrar la información del evento");
        }
        this.finalizarCarga();
      },
      error: (err) => {
        this.manejarError(err, "Error al cargar el evento");
      }
    });
  }


  getSafeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  handleGetSuccesfull(response: any) {
    this.evento = Object.assign(new Evento(), response.evento);
    this.localidades = response.localidades || [];
    this.mapaUrl = this.evento.venue?.urlMapa;

    if (this.mapaUrl && this.mapaUrl !== 'no') {
      this.mapaUrl = this.getSafeUrl(this.mapaUrl);
    } else {
      this.mapaUrl = null;
    }

    this.safeSrc = this.getSafeUrl(this.evento.video);
    this.fecha = new Date(this.evento.fechaApertura);
    this.startCountdown();
  }

  startCountdown(): void {
    let x = setInterval(() => {
      let fechaFutura = this.fecha.getTime();
      let hoy = new Date().getTime();
      let distancia = fechaFutura - hoy;
      this.meses = Math.floor(distancia / (1000 * 60 * 60 * 24) / 30);
      this.semanas = Math.floor(distancia / (1000 * 60 * 60 * 24 * 7));
      this.dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
      this.horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
      this.segundos = Math.floor((distancia % (1000 * 60)) / 1000);
      if (distancia < 0) {
        clearInterval(x);
        this.meses = 0;
        this.semanas = 0;
        this.dias = 0;
        this.horas = 0;
        this.minutos = 0;
        this.segundos = 0;
      }
    }, 1000);
  }

  darURL(tipo: number) {
    const primeraImagenTipo = this.evento.imagenes?.find(imagen => imagen.tipo === tipo);
    return primeraImagenTipo?.url || "";
  }

  darFecha(evento: Evento, inicio: boolean): string {
    let fechaR = evento.dias?.[0]?.fechaInicio;
    if (!inicio && evento.dias?.[0]?.fechaFin) {
      fechaR = evento.dias[0].fechaFin;
    }

    if (!fechaR) {
      return 'Por confirmar';
    }

    registerLocaleData(localeES, 'es');
    let dataPipe: DatePipe = new DatePipe('es');
    let fechaDate = new Date(fechaR.toString());
    let Word = dataPipe.transform(fechaDate, 'EEE dd');
    Word = Word![0].toUpperCase() + Word!.substring(1).toLowerCase();

    let Word2 = dataPipe.transform(fechaDate, 'MMM');
    Word2 = Word2![0].toUpperCase() + Word2!.substring(1).toLowerCase();

    let fecha = Word + " de " + Word2 + " de " + dataPipe.transform(fechaDate, 'yyyy');

    return fecha;
  }

  obtenerCantidad(localidad: any): number {
    const index = this.localidades.indexOf(localidad);
    return this.cantidades[index] || 0;
  }

  calcularTotal(localidad: any): number {
    const cantidad = this.obtenerCantidad(localidad);
    return (localidad.precio + localidad.servicio_iva + localidad.servicio) *
           localidad.cantidadPersonasPorTicket * cantidad;
  }

  AbrirCarrito(): void {
    if (this.cantidadTotal == 0) {
      this.mostrarError("Selecciona lo que deseas comprar");
      return;
    }

    if (this.authService.isAuthenticated()) {
      if (!this.cliente) {
        this.autenticar().then(() => {
          this.crearOrden();
        });
      } else {
        this.crearOrden();
      }
    } else {
      this.mostrarError("Debes estar registrado para poder realizar tu compra");
      this.router.navigate(['/login']);
    }
  }

  crearOrden(): void {
    const numerosNoCero = this.cantidades.filter(num => num !== 0);
    if (numerosNoCero.length == 1) {
      const posicion = this.cantidades.indexOf(numerosNoCero[0]);
      let localidad: Localidad = this.localidades[posicion];
      this.idLocalidad = localidad.id;
      let tipo: number = (localidad.tipo == 1 || localidad.tipo == 3) ? 4 : 1;
      this.iniciarCarga();
      this.ordenService.crearOrdenClienteCompra(this.cantidadTotal, this.idLocalidad, tipo, this.evento.id, this.cliente).subscribe({
        next: response => {
          if (response.ordenId) {
            this.router.navigate([`/eventos/carrito/${response.ordenId}`]).then(() => {
              window.scrollTo(0, 0);
            });
          } else if (response.mensaje) {
            this.finalizarCarga();
            this.mostrarError(response.mensaje);
          }
        }, error: error => {
          this.manejarError(error, "Sucedió un error al generar la orden, por favor intenta nuevamente");
        }
      });
    } else {
      this.mostrarError("No se permite la compra de más de una localidad por compra");
    }
  }

  async autenticar() {
    this.usuario = this.hardCodedAuthService.getUsuario() || '';
    if (this.usuario) {
      return new Promise((resolve) => {
        this.clienteDataService.getClientePago(this.usuario).subscribe({
          next: response => {
            this.cliente = response.cliente;
            resolve(true);
          }
        });
      });
    }
    return Promise.resolve(false);
  }

  // Métodos para el contador de cantidad y total  
  incrementarCantidad(localidad: any): void {
    if (this.localidadSeleccionadaId !== null && this.localidadSeleccionadaId !== localidad.id) {
      return;
    }
    const index = this.localidades.indexOf(localidad);
    if (this.localidadSeleccionadaId === null) {
      this.localidadSeleccionadaId = localidad.id;
    }
    if (this.cantidades[index] === undefined) {
      this.cantidades[index] = 0;
    }

    if (this.cantidades[index] < 7) {
      this.cantidades[index]++;
      this.actualizarTotal();
    }
  }

  decrementarCantidad(localidad: any): void {
    if (this.localidadSeleccionadaId !== null && this.localidadSeleccionadaId !== localidad.id) {
      return;
    }
    const index = this.localidades.indexOf(localidad);
    if (this.cantidades[index] > 0) {
      this.cantidades[index]--;
      this.actualizarTotal();

      if (this.cantidades[index] === 0) {
        this.localidadSeleccionadaId = null;
      }
    }
  }

  actualizarTotal(): void {
    this.cantidadTotal = this.cantidades.reduce((total, cantidad) => total + cantidad, 0);
    this.valorTotal = this.localidades.reduce((total, localidad, index) => {
      const cantidad = this.cantidades[index] || 0;
      return total + this.calcularTotal(localidad) * cantidad;
    }, 0);
  }

  onComprarLocalidad(event: {cantidad: number, localidad_id: number}): void {
    // Lógica de compra usando el nuevo componente (como MarcaBlancaClientes)
    if (this.hardCodedAuthService.getUsuario()) {
      if (!this.cliente) {
        this.autenticar().then(() => {
          this.crearOrdenNueva(event.cantidad, event.localidad_id);
        });
      } else {
        this.crearOrdenNueva(event.cantidad, event.localidad_id);
      }
    } else {
      this.mostrarError("Debes estar registrado para poder realizar tu compra");
      this.router.navigate(['/login']);
    }
  }

  private crearOrdenNueva(cantidad: number, localidad_id: number): void {
    this.iniciarCarga();
    
    console.log(this.idPromotor);

    // Usar el método apropiado según si hay promotor o no
    const ordenObservable = this.idPromotor 
      ? this.ordenService.crearOrdenNoNumeradaConPromotor(cantidad, localidad_id, this.evento.id, this.cliente?.numeroDocumento, this.idPromotor)
      : this.ordenService.crearOrdenNoNumerada(cantidad, localidad_id, this.evento.id, this.cliente?.numeroDocumento);

    ordenObservable.subscribe({
      next: response => {
        console.log(response);
        if (response.ordenId) {
          this.router.navigate([`/eventos/carrito/${response.ordenId}`]).then(() => {
            window.scrollTo(0, 0);
          });
        } else if (response.mensaje) {
          this.finalizarCarga();
          this.mostrarError(response.mensaje);
        }
      }, 
      error: error => {
        this.finalizarCarga();
        this.manejarError(error, "Sucedió un error al generar la orden, por favor intenta nuevamente");
      }
    });
  }
}