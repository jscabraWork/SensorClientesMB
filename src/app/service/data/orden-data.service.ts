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

  private apiOrdenesPromotores=`${API_URL_PAGOS}/ordenes-promotores`;

  private apiOrdenesAlcancias=`${API_URL_PAGOS}/ordenes_alcancias`;



  constructor(private http: HttpClient) { }


  crearOrdenNoNumerada(cantidad,idLocalidad, idEvento:number,numeroDocumento:string ){
    const params = new HttpParams()
    .set('pCantidad', cantidad)
    .set('pLocalidadId', idLocalidad)
    .set('pEventoId', idEvento.toString())
    .set('pClienteNumeroDocumento', numeroDocumento);
    return this.http.post<any>(`${this.apiOrdenes}/crear-no-numerada`, null, { params });
  }

  crearOrdenNumerada(idEvento:number, numeroDocumento:string, tickets: Ticket[]){
    const params = new HttpParams()
    .set('pEventoId', idEvento.toString())
    .set('pClienteNumeroDocumento', numeroDocumento);
    return this.http.post<any>(`${this.apiOrdenes}/crear-numerada`, tickets, { params });
  }

  crearOrdenIndividual(ticketPadreId: number, pCantidad, idEvento: number, numeroDocumento: string) {
  const params = new HttpParams()
    .set('pEventoId', idEvento.toString())
    .set('pCantidad', pCantidad.toString())
    .set('pTicketPadreId', ticketPadreId.toString())
    .set('pClienteNumeroDocumento', numeroDocumento);

  // Enviar los parámetros como query parameters, no como body
  return this.http.post<any>(`${this.apiOrdenes}/crear-individual`, null, { params });
  }

  // Métodos para órdenes con promotor
  crearOrdenNoNumeradaPromotor(cantidad, idLocalidad, idEvento: number, numeroDocumento: string, promotorId: string) {
    const params = new HttpParams()
      .set('pCantidad', cantidad)
      .set('pLocalidadId', idLocalidad)
      .set('pEventoId', idEvento)
      .set('pClienteNumeroDocumento', numeroDocumento)
      .set('pPromotorId', promotorId);
    return this.http.post<any>(`${this.apiOrdenesPromotores}/crear-no-numerada`, null, { params });
  }

  getInformacionCarritoDeCompras(pIdOrden){
    return this.http.get(`${this.apiOrdenes}/carrito/${pIdOrden}`);
  }

  getRespuestaOrden(pIdOrden){
    return this.http.get<any>(`${this.apiOrdenes}/orden/respuesta/${pIdOrden}`);
  }

  crearOrdenAporte(pAlcanciaId: number, pAporte: number) {
    const params = new HttpParams()
      .set('pAlcanciaId', pAlcanciaId.toString())
      .set('pAporte', pAporte.toString());

    return this.http.post<any>(`${this.apiOrdenesAlcancias}/crear-aporte`, null, { params });
  }

  aplicarCupon(pCuponId: string, pOrdenId: number) {
    const params = new HttpParams()
      .set('pCuponId', pCuponId)
      .set('pOrdenId', pOrdenId.toString());

    return this.http.post<any>(`${this.apiOrdenes}/aplicar-cupon`, null, { params });
  }


  getAllOrdenesEnProcesoByClienteId(correo: string){
    return this.http.get<any>(`${this.apiOrdenes}/enProceso/${correo}`);
  }

  validarOrdenPtp(pIdOrden){
    return this.http.get<any>(`${this.apiOrdenes}/manejo-orden/${pIdOrden}`);
  }

  getComprasPendientesByCliente(numeroDocumento: string) {
    return this.http.get<any[]>(`${this.apiOrdenes}/compras-pendientes/${numeroDocumento}`);
  }


}
