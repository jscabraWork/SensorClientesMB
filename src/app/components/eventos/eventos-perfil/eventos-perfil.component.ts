import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import localeES from '@angular/common/locales/es';

import { Evento } from '../../../models/evento.model';
import { EventoDataService } from '../../../service/data/evento-data.service';
import { OrdenDataService } from '../../../service/data/orden-data.service';
import { ClientesPagoDataService } from '../../../service/data/clientes-pago-data.service';
import { AuthService } from '../../../service/seguridad/auth.service';
import { BaseComponent } from '../../../common-ui/base.component';
import { HoraPipe } from '../../../pipes/horas.pipe';
import { HardcodedAutheticationService } from '../../../service/hardcoded-authetication.service';
import { SeleccionLocalidadComponent } from './seleccion-localidad/seleccion-localidad.component';
import { LoginComponent } from '../../login/login.component';

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
  mapaUrl: any;
  safeSrc: any = null;
  fecha: Date = new Date();
  fechaActual: Date = new Date();
  meses: number = 0;
  semanas: number = 0;
  dias: number = 0;
  horas: number = 0;
  minutos: number = 0;
  segundos: number = 0
  cantidadTotal: number = 0;
  cantidades: number[] = [];
  idLocalidad: any;
  clienteId: string = '';
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
        console.log(response);
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


 
  autenticar() {
    this.clienteId = this.hardCodedAuthService.getCC()
  }



  onComprarLocalidad(event: {cantidad: number, localidad_id: number}): void {
    // Lógica de compra usando el nuevo componente (como MarcaBlancaClientes)
    if (this.hardCodedAuthService.getCC()) {
      if (!this.clienteId) {
        this.autenticar();
      } 
        
      this.crearOrdenNueva(event.cantidad, event.localidad_id);
      
    } else {
      this.mostrarMensaje("Debes estar registrado para poder realizar tu compra").subscribe(() => {

          this.abrirIniciarSesion();
      });
    }
  }

  abrirIniciarSesion(): void {
      const dialogRef = this.dialog.open(LoginComponent, {
        width: '500px',
        maxWidth: '90vw',
        disableClose: false,
      });
    }

  private crearOrdenNueva(cantidad: number, localidad_id: number): void {
    this.iniciarCarga();
    
    console.log(this.idPromotor);

    // Usar el método apropiado según si hay promotor o no
    const ordenObservable = this.idPromotor 
      ? this.ordenService.crearOrdenNoNumeradaPromotor(cantidad, localidad_id, this.evento.id, this.clienteId, this.idPromotor)
      : this.ordenService.crearOrdenNoNumerada(cantidad, localidad_id, this.evento.id, this.clienteId);

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