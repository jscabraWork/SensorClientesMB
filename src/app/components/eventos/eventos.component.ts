import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import localeES from '@angular/common/locales/es';

import { EventoDataService } from '../../service/data/evento-data.service';
import { Evento } from '../../models/evento.model';
import { Ciudad } from '../../models/ciudad.model';
import { MensajeComponent } from '../mensaje/mensaje.component';
import { ResumirPipe2 } from '../../pipes/resumir2.pipe';
import { HoraPipe2 } from '../../pipes/horas2.pipe';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatDialogModule,
    MatIconModule,
    ResumirPipe2,
    HoraPipe2
  ],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.scss'
})
export class EventosComponent implements OnInit, OnDestroy {
  
  eventos: Evento[] = [];
  busqudaNombre: string = ''
  cargando: boolean = false
  numeroDocumento: string = ''
  idCiudad: number = -1
  busqueda: string = ''
  ciudades: Ciudad[] = []
  tipoEvento: string = '';
  tiposEventosDisponibles: any[] = [];
  imagenesConEvento: {url: string, eventoId: number}[] = [];
  currentIndex: number = 0;
  intervalId: any;
  fadeOut: boolean = false;

  constructor(
    private eventoDataService: EventoDataService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.idCiudad = -1
    this.tipoEvento = "-1"
    this.cargando = true;
    
    this.route.queryParams.subscribe(params => {
      if (params['nombre']) {
        this.busqudaNombre = params['nombre'];
      }
      
      if (params['nombre']) {
        this.buscar()
      } else {
        this.cargarEventos();
      }
    });   
  }


  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  iniciarCarrusel(): void {
    if (this.imagenesConEvento.length > 1) {
      this.intervalId = setInterval(() => {
        this.siguienteImagen();
      }, 4000);
    }
  }

  siguienteImagen(): void {
    if (this.imagenesConEvento.length > 0) {
      this.fadeOut = true;
      setTimeout(() => {
        this.currentIndex = (this.currentIndex + 1) % this.imagenesConEvento.length;
        this.fadeOut = false;
      }, 300);
    }
  }

  get imagenCarrusel(): string {
    if (this.imagenesConEvento.length > 0) {
      return this.imagenesConEvento[this.currentIndex]?.url || '';
    }
    return './../../assets/images/img/bannersensor.avif';
  }

  clickImagen(): void {
    
      const eventoId = this.imagenesConEvento[this.currentIndex].eventoId;
      this.router.navigate([`/eventos/evento/${eventoId}`]);
  }

  pausarCarrusel(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reanudarCarrusel(): void {
    if (!this.intervalId && this.imagenesConEvento.length > 1) {
      this.intervalId = setInterval(() => {
        this.siguienteImagen();
      }, 4000);
    }
  }

  irAImagenAnterior(): void {
    this.pausarCarrusel();
    this.fadeOut = true;
    setTimeout(() => {
      this.currentIndex = this.currentIndex === 0 ? 
        this.imagenesConEvento.length - 1 : 
        this.currentIndex - 1;
      this.fadeOut = false;
    }, 300);
    setTimeout(() => this.reanudarCarrusel(), 5000);
  }

  seleccionarImagen(index: number): void {
    this.pausarCarrusel();
    this.fadeOut = true;
    setTimeout(() => {
      this.currentIndex = index;
      this.fadeOut = false;
    }, 300);
    setTimeout(() => this.reanudarCarrusel(), 5000);
  }

  irAImagenSiguiente(): void {
    this.pausarCarrusel();
    this.siguienteImagen();
    setTimeout(() => this.reanudarCarrusel(), 5000);
  }

  cargarEventos(){
    this.eventoDataService.getAllEventosVisibles(2).subscribe(
      {
        next: response => {
          console.log("response", response);
          this.cargando = false;
          if(response && response.length < 0){
            this.cargando = false;
            this.openMensaje("No hay eventos disponibles")
          }else{
            this.handleSuccesfullGet(response);
          }
        }, error: error => {
          this.cargando = false;
          this.openMensaje("Hay un error, intenta mas tarde")
        }
      }
    )
  }

  buscar() {
    this.cargando = true;
    this.eventos = [];
    
    if (this.busqudaNombre === '') {
      this.busqudaNombre = "-1";
    }

    this.eventoDataService.getAllEventosFiltro(
      this.idCiudad || -1, 
      this.busqudaNombre, 
      this.tipoEvento || "-1"
    ).subscribe(
      response => {
        this.eventos = response.eventos;
        this.cargando = false;
        this.actualizarURLConParametros();
        this.busqudaNombre = ''
      },
      error => {
        this.cargando = false;
        this.openMensaje("Sucedió un error al buscar eventos");
      }
    );
  }

  actualizarURLConParametros() {
    const queryParams: any = {};

    if (this.busqudaNombre && this.busqudaNombre !== '-1') {
      queryParams.nombre = this.busqudaNombre;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
    });
  }

  darURL(evento: Evento) {
    const primeraImagenTipo1 = evento.imagenes.find(imagen => imagen.tipo === 1);
    var urlPrimeraImagenTipo1 = "";
    if (primeraImagenTipo1) {
      urlPrimeraImagenTipo1 = primeraImagenTipo1.url;
    }
    return urlPrimeraImagenTipo1
  }

  handleSuccesfullGet(response: any) {
    this.eventos = response.map((e: any) => Object.assign(new Evento(), e));
    this.ciudades = [];
    this.imagenesConEvento = [];

    this.eventos.forEach(evento => {
      if (evento.imagenes && evento.imagenes.length > 0) {
        const imagenesTipo2 = evento.imagenes.filter(imagen => imagen.tipo == 2);
        if(imagenesTipo2.length > 0){
          imagenesTipo2.forEach(imagen => {
            this.imagenesConEvento.push({
              url: imagen.url,
              eventoId: evento.id
            });
          });
        }
      }
    });

                this.iniciarCarrusel();


    this.ciudades = this.eventos
      .map(evento => evento.venue.ciudad)
      .filter((ciudad, index,self) =>
        self.findIndex(c => c.id === ciudad.id)=== index)

    this.tiposEventosDisponibles = this.eventos
    .map(evento => evento.tipo)
    .filter((tipo, index, self) =>
      self.indexOf(tipo) === index
    );
  }

  irAlEvento(eventoId: string){
    this.router.navigate([`/eventos/evento/${eventoId}`])
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
        mensaje: mensajeT,
      },
    });
  }
}
