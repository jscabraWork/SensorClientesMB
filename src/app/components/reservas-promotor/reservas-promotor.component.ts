import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { Reserva } from '../../models/reserva.model';
import { Evento } from '../../models/evento.model';
import { Localidad } from '../../models/localidad.model';

@Component({
  selector: 'app-reservas-promotor',
  standalone: true,
  imports: [ CommonModule,
      FormsModule,
      RouterModule,
      MatDialogModule],
  templateUrl: './reservas-promotor.component.html',
  styleUrl: './reservas-promotor.component.scss'
})
export class ReservasPromotorComponent implements OnInit {

  cargando: boolean = false
  reserva:Reserva
  evento: Evento
  localidad:Localidad

  constructor() { }

  ngOnInit(): void {
  }

}
