import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import localeES from '@angular/common/locales/es';

import { Localidad } from '../../../../models/localidad.model';
import { Evento } from '../../evento.model';
import { ClientePagos } from '../../../../models/cliente-pagos.model';
import { EventoDataService } from '../../../../service/data/evento-data.service';
import { HardcodedAutheticationService } from '../../../../service/hardcoded-authetication.service';
import { ClientesPagoDataService } from '../../../../service/data/clientes-pago-data.service';
import { OrdenDataService } from '../../../../service/data/orden-data.service';
import { MensajeComponent } from '../../../mensaje/mensaje.component';
import { MensajeLinkComponent } from '../../../mensaje-link/mensaje-link.component';
import { LoginComponent } from '../../../login/login.component';
import { HoraPipe } from '../../../../pipes/horas.pipe';

@Component({
  selector: 'app-compra',
  standalone: true,
  templateUrl: './compra.component.html',
  styleUrl: './compra.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    DatePipe,
    CurrencyPipe,
    HoraPipe
  ]
})
export class CompraComponent implements OnInit {
  miId: any;
  valorTotal: number = 0;
  evento: Evento = new Evento();
  cantidadTotal: number = 0;
  cantidades: number[] = [];
  cargando: boolean = false;
  idLocalidad: any;
  codigoVenta: any;
  localidades: Localidad[] = [];
  urlPrimeraImagenTipo1: string = '';
  usuario: string = '';
  cliente: ClientePagos | null = null;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private service: EventoDataService,
    private autenticador: HardcodedAutheticationService,
    private router: Router,
    private clienteDataService: ClientesPagoDataService,
    private ordenService: OrdenDataService
  ) { }

  ngOnInit(): void {
    this.cantidades = [];
    this.valorTotal = 0;
    this.cantidadTotal = 0;
    this.evento = new Evento();
    this.cargando = true;

    this.route.paramMap.subscribe(params => {
      this.miId = params.get('id');
      this.codigoVenta = params.get('codigoVenta');
      this.service.getEventoIdPerfilNoSoldOut(this.miId).subscribe(response => {
        if (response) {
          this.handleGetSuccesfull(response);
          this.darURL(1);
          this.cargando = false;
        } else {
          this.cargando = false;
          this.mensaje("No tienes ningun proceso de compra");
        }
      });
    });

    this.autenticar();
  }

  handleGetSuccesfull(response: any) {
    this.evento = response.evento;
    this.localidades = response.localidades;
    for (let i = 0; i < this.localidades.length; i++) {
      this.cantidades.push(0);
    }
  }

  agregarBoletasACompra(i: number) {
    this.valorTotal = 0;
    this.cantidadTotal = 0;
    var localidad = this.localidades[i];
    this.valorTotal += this.cantidades[i] * (localidad.precio + localidad.servicio + localidad.servicio_iva) * localidad.cantidadPersonasPorTicket;
    this.cantidadTotal = this.cantidadTotal + this.cantidades[i];
  }

  validar(i: number) {
    let encontro: boolean = false;
    let deshabilitar: boolean = true;
    let k: number;

    for (let j = 0; j < this.cantidades.length; j++) {
      if (this.cantidades[j] > 0) {
        encontro = true;
        k = j;
      }
    }
    if (encontro && k == i) {
      deshabilitar = false;
    }
    else if (!encontro) {
      deshabilitar = false;
    }
    return deshabilitar;
  }

  AbrirCarrito(): void {
    if (this.cantidadTotal == 0) {
      this.mensaje("Selecciona lo que deseas comprar");
      return;
    }

    if (this.autenticador.getUsuario()) {
      if (!this.cliente) {
        this.autenticar().then(() => {
          this.crearOrden();
        });
      }
      else {
        this.crearOrden();
      }
    }
    else {
      this.mensaje("Debes estar registrado en All Tickets para poder realizar tu compra, en caso de no estarlo por favor crea una cuenta nueva", true);
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
              this.router.navigate([`/dimensiones/carrito/${response.ordenId}`]);
            }
            else if (response.mensaje) {
              this.cargando = false;
              this.mensaje(response.mensaje);
            }
          }, error: error => {
            this.cargando = false;
            this.mensaje("Sucedio un error al generar la orden, por favor intenta nuevamente");
          }
        });
      }
      else {
        this.ordenService.crearOrdenClienteCompraPromotor(this.cantidadTotal, this.idLocalidad, tipo, this.evento.id, this.cliente, this.codigoVenta).subscribe({
          next: response => {
            if (response.ordenId) {
              this.router.navigate([`/dimensiones/carrito/${response.ordenId}`]);
            }
            else if (response.mensaje) {
              this.cargando = false;
              this.mensaje(response.mensaje);
            }
          }, error: error => {
            this.mensaje("Sucedio un error al generar la orden, por favor intenta nuevamente");
            this.cargando = false;
          }
        });
      }
    } else {
      this.mensaje("No se permite la compra de mas de una localidad por compra");
    }
  }

  darFecha(evento: Evento): string {
    if (evento.fecha == null) {
      return 'Por confirmar';
    }

    registerLocaleData(localeES, 'es');
    let dataPipe: DatePipe = new DatePipe('es');
    let Word = dataPipe.transform(evento.fecha, 'EEE dd');
    Word = Word![0].toUpperCase() + Word!.substr(1).toLowerCase();

    let Word2 = dataPipe.transform(evento.fecha, 'MMM');
    Word2 = Word2![0].toUpperCase() + Word2!.substr(1).toLowerCase();

    let fecha = Word + " de " + Word2 + " de " + dataPipe.transform(evento.fecha, 'yyyy');

    return fecha;
  }

  openDialogMensaje(mensaje: string, eventoId: any): void {
    const dialogRef = this.dialog.open(MensajeLinkComponent, {
      width: '600px',
      height: '250px',
      data: {
        mensaje: mensaje,
        id: eventoId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  mensaje(mensaje: string, login?: boolean): void {
    const dialogRef = this.dialog.open(MensajeComponent, {
      width: '600px',
      maxHeight: '250px',
      data: {
        mensaje: mensaje,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (login) {
        this.openDialog();
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.autenticar();
    });
  }

  darURL(tipo: number) {
    const primeraImagenTipo1 = this.evento.imagenes?.find(imagen => imagen.tipo === tipo);
    this.urlPrimeraImagenTipo1 = "";
    if (primeraImagenTipo1) {
      this.urlPrimeraImagenTipo1 = primeraImagenTipo1.url;
    }
    return this.urlPrimeraImagenTipo1;
  }

  async autenticar() {
    this.usuario = this.autenticador.getUsuario();
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
  }

  increment(index: number) {
    if (this.cantidades[index] < 6) {
      this.cantidades[index]++;
      this.agregarBoletasACompra(index);
    }
  }

  decrement(index: number) {
    if (this.cantidades[index] > 0) {
      this.cantidades[index]--;
      this.agregarBoletasACompra(index);
    }
  }
}