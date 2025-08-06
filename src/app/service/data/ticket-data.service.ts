import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonDataService } from '../commons/common-data.service';
import { Ticket } from '../../models/ticket.model';
import { API_URL_PAGOS } from '../../app.constants';

import { ClientePagos } from '../../models/cliente-pagos.model';

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


  public getInfoTicketPorId(id){
    return this.http.get<any>(`${this.baseEndpoint}/${id}/cliente/gestion`,{headers:this.headers});
  }
  
  asignarClienteAlTicket(ticket:Ticket,cliente:ClientePagos){
    return this.http.put<any>(`${this.baseEndpoint}/agregar-cliente/${ticket.id}`,cliente)
  }

   //Cambiar estado de ticket al seleccionarlo en mapas, si el estado se cambio correctamene retorna true
   public cambiarEstado(idTicket: number, estado: number): Observable<Ticket> {
    return this.http.put<{ ticket: Ticket }>(`${this.baseEndpoint}/estado/${idTicket}`, null, {
      headers: this.headers
    }).pipe(
      map(response => response.ticket)
    );
  }  

  public cambiarEstados(tickets: Ticket[], estado: number): Observable<Ticket> {
    const ticketsIds : number[] = []
    tickets.forEach(t=> ticketsIds.push(t.id))
    return this.http.put<{ ticket: Ticket }>(`${this.baseEndpoint}/estados/${estado}`, ticketsIds, {
      headers: this.headers
    }).pipe(
      map(response => response.ticket)
    );
  }
  
  mandarQR(ticketId: number): Observable<void> {
    return this.http.get<void>(`${this.baseEndpoint}/enviar-qr/${ticketId}`);
  }

  public contarTicketsDisponiblesDeLocalidad(localidadId: number, estado: number){
    return this.http.get<any>(`${this.baseEndpoint}/contarTickets/${localidadId}/estado/${estado}`,{headers:this.headers});
  }
  
  reclamarCortesia(localidadId: number, codigoId: string, cliente: ClientePagos) {
    return this.http.post<any>(`${this.baseEndpoint}/reclamar-cortesia`, cliente, 
      { headers: this.headers,
        params: { localidadId: localidadId.toString(), codigoId: codigoId },
      });
  }

}





