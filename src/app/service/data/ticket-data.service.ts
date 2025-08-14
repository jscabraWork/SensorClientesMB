import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonDataService } from '../commons/common-data.service';
import { Ticket } from '../../models/ticket.model';
import { API_URL_PAGOS } from '../../app.constants';


import { map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TicketDataService extends CommonDataService<Ticket>{

  
  protected override baseEndpoint=`${API_URL_PAGOS}/tickets`;

  
  protected override atributoListado="clientes";

  constructor(protected override http:HttpClient) {
    super(http)
   }


  

   //Cambiar estado de ticket al seleccionarlo en mapas, si el estado se cambio correctamene retorna true
   public cambiarEstado(idTicket: number, estado: number): Observable<Ticket> {
    return this.http.put<{ ticket: Ticket }>(`${this.baseEndpoint}/estado/${idTicket}`, null, {
      headers: this.headers
    }).pipe(
      map(response => response.ticket)
    );
  }  

  
  mandarQR(ticketId: number): Observable<void> {
    return this.http.get<void>(`${this.baseEndpoint}/enviar-qr/${ticketId}`);
  }

  

}





