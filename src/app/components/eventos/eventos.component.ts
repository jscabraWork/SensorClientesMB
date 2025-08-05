import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import localeES from '@angular/common/locales/es';

import { EventoDataService } from '../../service/data/evento-data.service';
import { Evento } from './evento.model';
import { Ciudad } from '../../models/ciudad.model';
import { MensajeComponent } from '../mensaje/mensaje.component';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.scss'
})
export class EventosComponent implements OnInit {
  
  eventos: Evento[] = [];
  busqudaNombre: string = ''
  cargando: boolean = false
  numeroDocumento: string = ''
  idCiudad: number = -1
  busqueda: string = ''
  ciudades: Ciudad[] = []
  tipoEvento: string = '';
  tiposEventosDisponibles: any[] = [];
  imagenesTipo4: any[] = [];
  resultados: any = '';
  currentIndex: number = 0;
  intervalId: any;
  transitionActive: boolean = true;

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

  cargarEventos(){
    this.eventoDataService.getAllEventosVisibles().subscribe(
      {
        next: response => {
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

  darFecha(evento: Evento): string {
    if(evento.fecha==null){
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

  handleSuccesfullGet(response: any) {
    this.eventos = response.eventos.map((e: any) => Object.assign(new Evento(), e));
    this.imagenesTipo4 = response.eventos.imagenes
    this.ciudades = response.ciudades;
    this.imagenesTipo4 = [];

    this.eventos.forEach(evento => {
      if (evento.imagenes && evento.imagenes.length > 0) {
          const imagenesTipo4 = evento.imagenes.filter(imagen => imagen.tipo == 4);
          if(imagenesTipo4.length > 0){
            imagenesTipo4.forEach(imagen => {
              this.imagenesTipo4.push({
                ...imagen,
                eventoId: evento.id
              })
            });
          }
        }
    });

    this.ciudades = this.eventos
      .map(evento => evento.ciudad)
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
