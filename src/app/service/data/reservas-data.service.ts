import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Palco } from '../../models/palco.model';
import { API_URL_PAGOS } from '../../app.constants';
import { Evento } from '../../components/eventos/evento.model';
import { Reserva } from '../../models/reserva.model';
import { CommonDataService } from '../commons/common-data.service';

@Injectable({
  providedIn: 'root'
})
export class ReservasDataService extends CommonDataService<Reserva>{


  constructor(protected http: HttpClient) {
    super(http)
   }

protected override baseEndpoint = API_URL_PAGOS +"/reservas"

 protected override atributoListado="reservas";

}