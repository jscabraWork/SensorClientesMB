import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL_PAGOS, API_URL_PROMOTORES } from '../../app.constants';
import { Evento } from '../../models/evento.model';
import { Reserva } from '../../models/reserva.model';
import { CommonDataService } from '../commons/common-data.service';

@Injectable({
  providedIn: 'root'
})
export class ReservasDataService extends CommonDataService<Reserva>{


protected override baseEndpoint = API_URL_PROMOTORES +"/reservas"

 protected override atributoListado="reservas";

}
