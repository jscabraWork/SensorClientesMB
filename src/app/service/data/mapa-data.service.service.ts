import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Mapa } from '../../models/mapa-models/mapa.model';
import { CommonDataService } from '../commons/common-data.service';
import { API_URL_PAGOS } from '../../app.constants';
import { Ticket } from '../../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class MapaDataService extends CommonDataService<Mapa>
{
  protected override baseEndpoint=`${API_URL_PAGOS}/mapas`;
  protected override atributoListado="";

  constructor(protected http: HttpClient) {
    super(http)
   }


  public procesarTicket(idTicket: number) {
    return this.http.put<any>(`${API_URL_PAGOS}/tickets/procesar/${idTicket}`, null, {
      headers: this.headers
    });
  }  

  public liberarTicket(idTicket: number) {
    return this.http.put<any>(`${API_URL_PAGOS}/tickets/liberar/${idTicket}`, null, {
      headers: this.headers
    });
  }  

  public cambiarEstados(tickets: Ticket[]) {
    const ticketsIds : number[] = []
    tickets.forEach(t=> ticketsIds.push(t.id))
    return this.http.put<{ ticket: Ticket[] }>(`${API_URL_PAGOS}/tickets/estados`, ticketsIds, {
      headers: this.headers
    }).pipe(
      map(response => response.ticket)
    );
  } 

  
  
}