import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Evento } from '../../../eventos/evento.model';
import { Localidad } from '../../../../models/localidad.model';
import { Ticket } from '../../../../models/ticket.model';
import { TicketDataService } from '../../../../service/data/ticket-data.service';
import { MensajeComponent } from '../../../mensaje/mensaje.component';

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

  tickets: Ticket[] = [];
  localidades: Localidad[] = [];
  eventos: Evento[] = [];

  constructor(
    private ticketsDataService: TicketDataService, 
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.tickets = [];
    this.eventos = [];
    this.localidades = [];
    this.cargando = true;
    
    this.ticketsDataService.listarPorAtributo(this.numeroDocumento).subscribe({
      next: response => {
        this.cargando = false;

        if (!response.mensaje) {
          this.tickets = response.tickets;
          this.localidades = response.infoEventos.body.localidades;
          this.eventos = response.infoEventos.body.eventos;
        }
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
    this.openMensaje('QR Enviado a su correo exitosamente. Revise Spam');
    this.ticketsDataService.mandarQR(ticketId).subscribe({
      next: () => {
        // QR sent successfully
      },
      error: (error) => {
        this.openMensaje('Ocurrió un error al enviar el QR');
      }
    });
  }
}