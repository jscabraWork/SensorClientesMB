import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title, DomSanitizer } from '@angular/platform-browser';
import localeES from '@angular/common/locales/es';

import { Evento } from '../evento.model';
import { Localidad } from '../../../models/localidad.model';
import { ClientePagos } from '../../../models/cliente-pagos.model';
import { EventoDataService } from '../../../service/data/evento-data.service';
import { OrdenDataService } from '../../../service/data/orden-data.service';
import { ClientesPagoDataService } from '../../../service/data/clientes-pago-data.service';
import { HardcodedAutheticationService } from '../../../service/hardcoded-authetication.service';
import { SeoService } from '../../../service/seo.service';

@Component({
  selector: 'app-eventos-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eventos-perfil.component.html',
  styleUrl: './eventos-perfil.component.scss'
})
export class EventosPerfilComponent implements OnInit {
  miId: string = '';
  evento: Evento = new Evento();
  mapaUrl: any;
  safeSrc: any = null;
  fecha: Date = new Date();
  fechaActual: Date = new Date();
  localidades: Localidad[] = [];
  cargando = false;
  mapaV: boolean = false;
  organizadorId: any;
  organizadorNombre: string = '';
  pulep: boolean = false;
  codigoVenta: string = '';
  meses: number = 0;
  semanas: number = 0;
  dias: number = 0;
  horas: number = 0;
  minutos: number = 0;
  segundos: number = 0;
  listaImagenes: string[] = [];
  metaPixel: any;
  cantidadTotal: number = 0;
  cantidades: number[] = [];
  idLocalidad: any;
  cliente: ClientePagos = {} as ClientePagos;
  usuario: string = '';
  valorTotal: number = 0;
  localidadSeleccionadaId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private meta: Meta,
    private title: Title,
    private service: EventoDataService,
    private sanitizer: DomSanitizer,
    private seoService: SeoService,
    private ordenService: OrdenDataService,
    private router: Router,
    private autenticador: HardcodedAutheticationService,
    private clienteDataService: ClientesPagoDataService
  ) {}

  ngOnInit(): void {
    this.cantidades = [];
    this.valorTotal = 0;
    this.cantidadTotal = 0;
    this.evento = new Evento();
    this.mapaV = false;
    this.listaImagenes = [];
    this.evento = new Evento();
    this.evento.fecha = null as any;
    this.evento.fechaFin = null as any;
    this.evento.imagenes = [];
    this.evento.adicionales = [];
    this.cargando = true;

    this.route.paramMap.subscribe((params) => {
      this.miId = params.get('id') || '';
      this.codigoVenta = params.get('codigoVenta') || '';

      const pulep = Number(this.miId);

      if (isNaN(pulep)) {
        this.service.getEventoIdPerfilPulep(this.miId).subscribe((response: any) => {
          this.miId = response;
          this.getEventoPerfil();
        });
      } else {
        this.getEventoPerfil();
      }
    });
  }

  getEventoPerfil(): void {
    this.service.getEventoIdPerfil(this.miId).subscribe((response) => {
      this.cargando = false;
      if (response !== null) {
        this.handleGetSuccesfull(response);
      } else {
        this.cargando = false;
        this.openMensaje("No se puede mostrar la información del evento, por favor regresa al menú principal");
      }
      this.safeSrc = this.getSafeUrl(this.evento.video);
      this.fecha = new Date(this.evento.fechaApertura);
      this.startCountdown();
    });
  }

  getSafeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  handleGetSuccesfull(response: any) {
    this.evento = Object.assign(new Evento(), response.evento);
    this.organizadorId = response.organizador;
    this.localidades = response.localidades;
    this.mapaUrl = response.evento.url_mapa;
    this.organizadorNombre = response.organizadorNombre;

    if (this.mapaUrl !== 'no') {
      this.mapaUrl = this.getSafeUrl(this.mapaUrl);
      this.mapaV = true;
    } else {
      this.mapaUrl = null;
      this.mapaV = false;
    }

    // Obtener la URL de la imagen principal para OG
    let imagenOG = this.darURL(1);

    // Asegurarse de que la URL sea absoluta
    if (imagenOG && !imagenOG.startsWith('http')) {
      imagenOG = `${window.location.origin}${imagenOG}`;
    }

    // Usar el SeoService para actualizar todas las meta etiquetas OG
    this.seoService.updateOgMetaTags({
      title: this.evento.nombre,
      description: this.evento.descripcion || `Evento: ${this.evento.nombre} en ${this.evento.ciudad || 'Colombia'}`,
      imageUrl: imagenOG
    });

    this.title.setTitle(this.evento.nombre);
    this.darURLTipos2();
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

  darURLTipos2() {
    this.listaImagenes = this.evento.imagenes
      .filter(imagen => imagen.tipo === 2)
      .map(imagen => imagen.url);
  }

  darURL(tipo: number) {
    const primeraImagenTipo1 = this.evento.imagenes.find(imagen => imagen.tipo === tipo);
    var urlPrimeraImagenTipo1 = "";
    if (primeraImagenTipo1) {
      urlPrimeraImagenTipo1 = primeraImagenTipo1.url;
    }
    return urlPrimeraImagenTipo1;
  }

  darFecha(evento: Evento, inicio: boolean): string {
    let fechaR = evento.fecha;
    if (!inicio) {
      fechaR = evento.fechaFin;
    }

    if (fechaR == null) {
      return 'Por confirmar';
    }

    registerLocaleData(localeES, 'es');
    let dataPipe: DatePipe = new DatePipe('es');
    let Word = dataPipe.transform(fechaR, 'EEE dd');
    Word = Word![0].toUpperCase() + Word!.substr(1).toLowerCase();

    let Word2 = dataPipe.transform(fechaR, 'MMM');
    Word2 = Word2![0].toUpperCase() + Word2!.substr(1).toLowerCase();

    let fecha = Word + " de " + Word2 + " de " + dataPipe.transform(fechaR, 'yyyy');

    return fecha;
  }

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

  obtenerCantidad(localidad: any): number {
    const index = this.localidades.indexOf(localidad);
    return this.cantidades[index] || 0;
  }

  calcularTotal(localidad: any): number {
    const cantidad = this.obtenerCantidad(localidad);
    return (localidad.precio + localidad.servicio_iva + localidad.servicio) *
           localidad.cantidadPersonasPorTicket * cantidad;
  }

  actualizarTotal(): void {
    this.cantidadTotal = this.cantidades.reduce((total, cantidad, index) => {
      const localidad = this.localidades[index];
      return total + (cantidad || 0) * localidad.cantidadPersonasPorTicket;
    }, 0);
  }

  AbrirCarrito(): void {
    if (this.cantidadTotal == 0) {
      this.openMensaje("Selecciona lo que deseas comprar");
      return;
    }

    if (this.autenticador.getUsuario()) {
      if (!this.cliente) {
        this.autenticar().then(() => {
          this.crearOrden();
        });
      } else {
        this.crearOrden();
      }
    } else {
      this.mensaje("Debes estar registrado en Sensor para poder realizar tu compra, en caso de no estarlo por favor crea una cuenta nueva", true);
    }
  }

  crearOrden(): void {
    const numerosNoCero = this.cantidades.filter(num => num !== 0);
    if (numerosNoCero.length == 1) {
      const posicion = this.cantidades.indexOf(numerosNoCero[0]);
      let localidad: Localidad = this.localidades[posicion];
      this.idLocalidad = localidad.id;
      let tipo: number = (localidad.tipo == 1 || localidad.tipo == 3) ? 4 : 1;
      this.cargando = true;

      if (!this.codigoVenta) {
        this.ordenService.crearOrdenClienteCompra(this.cantidadTotal, this.idLocalidad, tipo, this.evento.id, this.cliente).subscribe({
          next: response => {
            if (response.ordenId) {
              this.router.navigate([`/eventos/carrito/${response.ordenId}`]);
            } else if (response.mensaje) {
              this.cargando = false;
              this.openMensaje(response.mensaje);
            }
          }, error: error => {
            this.cargando = false;
            this.openMensaje("Sucedió un error al generar la orden, por favor intenta nuevamente");
          }
        });
      }
    } else {
      this.openMensaje("No se permite la compra de más de una localidad por compra");
    }
  }

  async autenticar() {
    this.usuario = this.autenticador.getUsuario() || '';
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

  openMensaje(mensajeT: string): void {
    console.log('Mensaje:', mensajeT);
    // Aquí podrías implementar un modal o toast
  }

  mensaje(mensaje: string, login?: boolean): void {
    console.log('Mensaje:', mensaje);
    if (login) {
      this.openDialog();
    }
  }

  openDialog(): void {
    this.router.navigate(['/login']);
  }
}