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
import { Evento } from '../../../../models/evento.model';
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
export class AgregarAmigosComponent {
}
