import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { MensajeComponent } from '../../../../mensaje/mensaje.component';
import { ClientePagos } from '../../../../../models/cliente-pagos.model';
import { Ticket } from '../../../../../models/ticket.model';
import { ClientesPagoDataService } from '../../../../../service/data/clientes-pago-data.service';
import { OrdenDataService } from '../../../../../service/data/orden-data.service';
import { TicketDataService } from '../../../../../service/data/ticket-data.service';

@Component({
  selector: 'app-cambiar-duenio',
  standalone: true,
  templateUrl: './cambiar-duenio.component.html',
  styleUrls: ['./cambiar-duenio.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule
  ]
})
export class CambiarDuenioComponent implements OnInit {
  clienteNuevo: ClientePagos = new ClientePagos();
  ticket: Ticket = new Ticket();
  eventoId: number = 0;
  numeroDocumento: string = '';
  cargando: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataServicio: ClientesPagoDataService,
    private dialog: MatDialog,
    private ticketService: OrdenDataService
  ) {}

  ngOnInit(): void {
    this.clienteNuevo = new ClientePagos();
    this.ticket = this.data.ticket;
    this.eventoId = this.data.eventoId;
  }

  buscarCliente(): void {
    if (!this.numeroDocumento || this.numeroDocumento.trim() === '') {
      this.openMensaje('Por favor ingresa un número de documento');
      return;
    }

    this.dataServicio.getCliente(this.numeroDocumento).subscribe({
      next: response => {
        if (response != null) {
          this.clienteNuevo = response;
        } else {
          this.openMensaje('No tenemos este numero de documento registrado');
        }
      },
      error: error => {
        this.openMensaje('Error al buscar el cliente');
      }
    });
  }

  asignar(): void {
    if (this.clienteNuevo == null || this.clienteNuevo.numeroDocumento == null) {
      this.openMensaje('Busca un usuario registrado en All Tickets');
    } else {
      this.cargando = true;
      
      this.ticketService.transferirTicket(this.ticket, this.clienteNuevo.numeroDocumento, this.eventoId)
        .subscribe({
          next: response => {
            this.cargando = false;
            this.openMensaje(response.mensaje);
          },
          error: error => {
            this.cargando = false;
            this.openMensaje(error.error?.message || 'Error al transferir el ticket');
          }
        });
    }
  }

  closeDialog(): void {
    this.dialog.closeAll();
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

    if (openD === 'closeAll') {
      dialogRef.afterClosed().subscribe(() => {
        this.dialog.closeAll();
      });
    }
  }
}