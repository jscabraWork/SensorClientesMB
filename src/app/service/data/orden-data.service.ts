import { Injectable } from '@angular/core';

import { API_URL_PAGOS } from './../../app.constants';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ClientePagos } from '../../models/cliente-pagos.model';
import { Ticket } from '../../models/ticket.model';


@Injectable({
  providedIn: 'root'
})
export class OrdenDataService {

  private apiOrdenes=`${API_URL_PAGOS}/ordenes`;

  private apiOrdenesVendedores=`${API_URL_PAGOS}/ordenes-promotores`;

  private apiOrdenesAlcancias=`${API_URL_PAGOS}/ordenes-alcancia`;

  private apiOrdenesAdicionales=`${API_URL_PAGOS}/ordenes-adicionales`;

  private apiOrdenesParticularidades=`${API_URL_PAGOS}/ordenes-particularidades`;

  private apiOrdenesTraspaso=`${API_URL_PAGOS}/ordenes-traspaso`;


  constructor(private http: HttpClient) { }

  crearOrdenClienteCompra(cantidad,idLocalidad,tipo:number, idEvento:number,cliente:ClientePagos){

    const params = new HttpParams()
    .set('cantidad', cantidad)
    .set('idLocalidad', idLocalidad)
    .set('tipo', tipo.toString())
    .set('idEvento',idEvento.toString());
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

   return this.http.post<any>(`${this.apiOrdenes}/crear`,cliente,{params,headers});
  }


  crearOrdenClienteCompraPromotor(cantidad,idLocalidad,tipo:number, idEvento:number,cliente:ClientePagos, usuario:string){

    const params = new HttpParams()
    .set('cantidad', cantidad)
    .set('idLocalidad', idLocalidad)
    .set('tipo', tipo.toString())
    .set('idEvento',idEvento.toString())
    .set('usuario',usuario);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this.http.post<any>(`${this.apiOrdenesVendedores}/crear/promotor`,cliente,{params,headers});
  }

  
  

  crearOrdenClienteCompraNumerados(tipo:number, idEvento:number,idCliente:string,tickets:Ticket[]){

    const params = new HttpParams()
    .set('tipo', tipo.toString())
    .set('idEvento',idEvento.toString())
    .set('idCliente',idCliente);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

   return this.http.post<any>(`${this.apiOrdenes}/crear-numerados`,tickets,{params,headers});
  }


  crearOrdenClienteCompraNumeradosPromotor(tipo:number, idEvento:number,idCliente:string,tickets:Ticket[], usuario){

    const params = new HttpParams()
    .set('tipo', tipo.toString())
    .set('idEvento',idEvento.toString())
    .set('idCliente',idCliente)
    .set('usuario',usuario);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

   return this.http.post<any>(`${this.apiOrdenesVendedores}/crear-numerados/promotor`,tickets,{params,headers});
  }

  getInformacionCarritoDeCompras(pIdOrden){
    return this.http.get(`${this.apiOrdenes}/ver/${pIdOrden}`);
  }


  crearOrdenAlcanciaCompra(idEvento:number,pIdAlcancia:number,cliente:ClientePagos){

    const params = new HttpParams()

    .set('idEvento',idEvento.toString())
    .set('pIdAlcancia',pIdAlcancia.toString());
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

   return this.http.post<any>(`${this.apiOrdenesAlcancias}/crear`,cliente,{params,headers});
  }


  crearOrdenAdicionesCompra(idEvento,idTicket:number,cliente:ClientePagos, cantidad){

    const params = new HttpParams()

    .set('idEvento',idEvento)
    .set('pIdTicket',idTicket)
    .set('cantidad',cantidad);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

   return this.http.post<any>(`${this.apiOrdenesAdicionales}/crear`,cliente,{params,headers});
  }

  crearOrdenCupon(pIdOrden,pIdCupon){

    const params = new HttpParams()
    .set('pIdOrden', pIdOrden)
    .set('pIdCupon', pIdCupon)
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

   return this.http.put<any>(`${this.apiOrdenesParticularidades}/agregar-cupon`,null,{params,headers});
  }


  crearOrdenAdicional(pIdOrden,pAdicional){

    const params = new HttpParams()
    .set('pIdOrden', pIdOrden)
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

   return this.http.put<any>(`${this.apiOrdenesParticularidades}/agregar-adicional`,pAdicional,{params,headers});
  }

  crearOrdenPalcoIndividual(idEvento: number, idCliente: string, idTicketPadre: number, cantidad: number, tipo: number) {
    const params = new HttpParams()
      .set('idEvento', idEvento.toString())
      .set('idCliente', idCliente)
      .set('idTicket', idTicketPadre.toString())
      .set('cantidad', cantidad.toString())
      .set('tipo',tipo.toString());
  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    return this.http.post<any>(`${this.apiOrdenes}/orden-palco-individual`, null, { params, headers });
  }


  crearOrdenPalcoIndividualPromotor(idEvento: number, idCliente: string, idTicketPadre: number, cantidad: number, usuario, tipo: number) {
    const params = new HttpParams()
      .set('idEvento', idEvento.toString())
      .set('idCliente', idCliente)
      .set('idTicket', idTicketPadre.toString())
      .set('cantidad', cantidad.toString())
      .set('usuario', usuario)
      .set('tipo',tipo.toString());
  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    return this.http.post<any>(`${this.apiOrdenesVendedores}/orden-palco-individual-promotor`, null, { params, headers });
  }

  getAllOrdenesEnProcesoByClienteId(correo: string){
    return this.http.get<any>(`${this.apiOrdenes}/enProceso/${correo}`);
  }

  getRespuestaOrden(pIdOrden){
    return this.http.get<any>(`${this.apiOrdenes}/orden/respuesta/${pIdOrden}`);
  }

  validarOrdenPtp(pIdOrden){
    return this.http.get<any>(`${this.apiOrdenes}/manejo-orden/${pIdOrden}`);
  }


  //ORDENES TRASPASO

  transferirTicket(ticket, pNumeroDocumento, pEventoId){

    const params = new HttpParams()
    .set('pNumeroDocumento', pNumeroDocumento)
    .set('pEventoId',pEventoId)
   return this.http.post<any>(`${this.apiOrdenesTraspaso}/transferir/${ticket.id}`,null,{params});
  }



}
