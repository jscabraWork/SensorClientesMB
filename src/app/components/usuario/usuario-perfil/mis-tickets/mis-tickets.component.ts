import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Evento } from '../../../../models/evento.model';
import { Localidad } from '../../../../models/localidad.model';
import { Ticket } from '../../../../models/ticket.model';
import { MisTicketsDto } from '../../../../models/mistickets.model';
import { TicketDataService } from '../../../../service/data/ticket-data.service';
import { MensajeComponent } from '../../../mensaje/mensaje.component';
import { QrDataService } from '../../../../service/data/qr-data.service';

@Component({
  selector: 'app-mis-tickets',
  standalone: true,
  templateUrl: './mis-tickets.component.html',
  styleUrls: ['./mis-tickets.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule
  ]
})
export class MisTicketsComponent implements OnInit {
  cargando: boolean = false;
  mensaje: string = '';
  
  @Input()
  numeroDocumento: string = '';

  misTickets: MisTicketsDto[] = [];

  constructor(
    private ticketsDataService: TicketDataService, 
    private qrDataService: QrDataService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.misTickets = [];
    this.cargando = true;
    
    this.ticketsDataService.getMisTicketsByCliente(this.numeroDocumento).subscribe({
      next: (misTickets: MisTicketsDto[]) => {
        this.cargando = false;
        this.misTickets = misTickets;
      },
      error: error => {
        this.cargando = false;
        this.openMensaje('Ocurrió un error al cargar los tickets');
      }
    });
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

  enviarQR(ticketId: number): void {
    this.qrDataService.enviarQR(ticketId, this.numeroDocumento).subscribe({
      next: () => {
        this.openMensaje('QR Enviado a su correo exitosamente. Revise Spam');
      },
      error: (error) => {
        if (error.error?.error) {
          this.openMensaje(error.error.error);
        } else {
          this.openMensaje('Ocurrió un error al enviar el QR');
        }
      }
    });
  }

  getEstadoTexto(estado: number): string {
    switch (estado) {
      case 0: return 'DISPONIBLE';
      case 1: return 'VENDIDO';
      case 2: return 'RESERVADO';
      case 3: return 'EN PROCESO';
      case 4: return 'NO DISPONIBLE';
      default: return 'DESCONOCIDO';
    }
  }

  getEstadoColor(estado: number): string {
    switch (estado) {
      case 0: return '#28a745'; // Verde
      case 1: return '#17a2b8'; // Azul
      case 2: return '#ffc107'; // Amarillo
      case 3: return '#fd7e14'; // Naranja
      case 4: return '#dc3545'; // Rojo
      default: return '#6c757d'; // Gris
    }
  }

  getUtilizadoTexto(utilizado: boolean): string {
    return utilizado ? 'UTILIZADO' : 'DISPONIBLE';
  }

  getUtilizadoColor(utilizado: boolean): string {
    return utilizado ? '#dc3545' : '#28a745'; // Rojo si utilizado, verde si disponible
  }
}