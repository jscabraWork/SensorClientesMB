import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { respuesta } from '../../../../app.constants';
import { HardcodedAutheticationService } from '../../../../service/hardcoded-authetication.service';
import { Cliente } from '../../cliente.model';
import { MensajeComponent } from '../../../mensaje/mensaje.component';
import { OrdenDataService } from '../../../../service/data/orden-data.service';
import { PtpDataService } from '../../../../service/data/ptp-data.service';
import { Ticket } from '../../../../models/ticket.model';
import { TicketDataService } from '../../../../service/data/ticket-data.service';
import { Evento } from '../../../eventos/evento.model';
import { Localidad } from '../../../../models/localidad.model';
import { ClientesPagoDataService } from '../../../../service/data/clientes-pago-data.service';

@Component({
  selector: 'app-agregar-amigos',
  standalone: true,
  templateUrl: './agregar-amigos.component.html',
  styleUrls: ['./agregar-amigos.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatDialogModule
  ]
})
export class AgregarAmigosComponent implements OnInit {
  clienteNoEsNulo: boolean = false;
  user: string = '';
  usuario: Cliente = new Cliente();
  ticket: Ticket = new Ticket();
  idTicket: string = '';
  clientes: Cliente[] = [];
  clienteAgregado: Cliente = new Cliente();
  numeroDocumento: string = '';

  asientos: Ticket[] = [];
  referenceCode: string = '';
  porcentaje: number = 0;
  borrar: boolean = false;
  taxAdicion: number = 0;

  idEvento: string = '';

  valorPagarAdicion: number = 0;
  seleccionAdicion: number = 0;
  listaAdiciones: number[] = [];
  entrarPersonas: number = 0;

  respuesta: any;
  codigoOrden: string = '';
  descripcion: string = '';
  cargando: boolean = false;
  url: string = '';
  eventos: Evento[] = [];
  localidades: Localidad[] = [];

  constructor(
    private route: ActivatedRoute,
    private ptpService: PtpDataService,
    private ordenService: OrdenDataService,
    private autenticador: HardcodedAutheticationService,
    private ticketService: TicketDataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargando = true;
    this.respuesta = respuesta;
    this.entrarPersonas = 0;
    this.listaAdiciones = [];
    this.borrar = false;
    this.clienteAgregado = new Cliente();
    this.usuario = new Cliente();
    this.ticket = new Ticket();

    this.user = this.autenticador.getUsuario();

    this.route.paramMap.subscribe(params => {
      this.idTicket = params.get('idTicket') || '';
      this.refrescarTicket();
    });
  }

  refrescarTicket(): void {
    if (this.usuario != null) {
      this.ticketService.getInfoTicketPorId(this.idTicket).subscribe({
        next: response => {
          this.usuario = response.cliente;
          this.ticket = response.ticket;
          this.clientes = response.clientes;
          this.localidades = response.infoEventos.body.localidades;
          this.eventos = response.infoEventos.body.eventos;
          this.asientos = response.asientos;
          
          let cantidad = this.ticket.maximoAdiciones - (this.asientos.length + 1);
          for (let i = 1; i <= cantidad; i++) {
            this.listaAdiciones.push(i);
          }

          this.cargando = false;
        },
        error: error => {
          this.cargando = false;
          this.openMensaje('Error al cargar la información del ticket');
        }
      });
    } else {
      this.cargando = false;
    }
  }

  cambiarTotalAdicion(): void {
    this.taxAdicion = this.seleccionAdicion * this.ticket.servicioIvaAdicion;
    this.valorPagarAdicion = this.seleccionAdicion * (this.ticket.precioAdicion + this.ticket.servicioAdicion + this.ticket.servicioIvaAdicion);
  }

  agregarCliente(): void {
    let clienteEncontrado = false;
    for (let i = 0; i < this.clientes.length; i++) {
      if (this.clienteAgregado.numeroDocumento === this.clientes[i].numeroDocumento) {
        clienteEncontrado = true;
        break;
      }
    }

    if (!clienteEncontrado) {
      if (this.clienteAgregado.numeroDocumento == null || this.clienteAgregado.numeroDocumento === '') {
        this.openMensaje('Agrega un amigo para continuar');
      } else {
        // Logic for adding friend would go here
      }
    } else {
      this.openMensaje('Este cliente ya esta en el ticket');
    }
  }

  quitarCliente(idCliente: string): void {
    if (this.clientes.length === 1) {
      this.openMensaje('No puedes eliminar al ultimo participante del ticket');
    } else {
      // Logic for removing client would go here
    }
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
    
    if (openD === 'onInit') {
      this.ngOnInit();
    }
  }

  pago(): void {
    if (!this.cargando) {
      this.cargando = true;

      this.ordenService.crearOrdenAdicionesCompra(this.eventos[0].id, this.ticket.id, this.clientes[0], this.seleccionAdicion)
        .subscribe({
          next: response => {
            this.codigoOrden = response.idOrden;
            this.descripcion = 'Aporte al ticket ' + (this.ticket.numero_dentro_de_evento || this.ticket.id);
            this.ptp();
          },
          error: error => {
            this.cargando = false;
            this.openMensaje('Error al crear la orden');
          }
        });
    }
  }

  ptp(): void {
    this.ptpService.getPeticionPTP(this.codigoOrden, this.valorPagarAdicion, this.descripcion, this.taxAdicion, 0)
      .subscribe({
        next: response => {
          window.location.href = response.processUrl;
        },
        error: error => {
          this.cargando = false;
          this.openMensaje('Sucedio un error por favor vuelva a intentar');
        }
      });
  }

  openDialog2(ticket: Ticket): void {
    // Dynamic import for the dialog component
    import('./cambiar-duenio/cambiar-duenio.component').then(({ CambiarDuenioComponent }) => {
      const dialogRef = this.dialog.open(CambiarDuenioComponent, {
        width: '600px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        data: {
          ticket: ticket,
          eventoId: this.eventos[0].id,
        },
      });

      dialogRef.afterClosed().subscribe(() => {
        this.dialog.closeAll();
        this.ngOnInit();
      });
    });
  }
}