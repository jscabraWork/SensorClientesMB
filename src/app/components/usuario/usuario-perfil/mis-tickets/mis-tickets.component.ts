import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MisTicketsDto } from '../../../../models/mistickets.model';
import { TicketDataService } from '../../../../service/data/ticket-data.service';
import { MensajeComponent } from '../../../mensaje/mensaje.component';
import { QrDataService } from '../../../../service/data/qr-data.service';
import { TraspasarTicketComponent } from './traspasar-ticket/traspasar-ticket.component';
import { Ticket } from '../../../../models/ticket.model';

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
    this.qrDataService.enviarQR(ticketId).subscribe({
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

  getUtilizadoTexto(utilizado: boolean): string {
    return utilizado ? 'UTILIZADO' : 'NO UTILIZADO';
  }

  getUtilizadoColor(utilizado: boolean): string {
    return utilizado ? '#dc3545' : '#28a745'; // Rojo si utilizado, verde si disponible
  }

  abrirModalTraspaso(misTicket: MisTicketsDto): void {
    const ticket: Ticket = misTicket.ticket;

    const dialogRef = this.dialog.open(TraspasarTicketComponent, {
      data: { ticket: ticket },
      disableClose: true,
      panelClass: 'custom-modal-panel'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Si el traspaso fue exitoso, recargar los tickets
        this.ngOnInit();
      }
    });
  }
}