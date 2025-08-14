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
export class CambiarDuenioComponent {
  
}