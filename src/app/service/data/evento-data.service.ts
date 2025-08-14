import {  API_URL_PAGOS } from './../../app.constants';
import { Evento } from '../../models/evento.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class EventoDataService {

  constructor(private http: HttpClient) { }

  apiEventos=`${API_URL_PAGOS}/eventos`

  getById(pIdEvento){
    return this.http.get<Evento>(`${this.apiEventos}/${pIdEvento}`);
  }

  getAllEventosVisibles(pEstado: number){
    return this.http.get<Evento[]>(`${this.apiEventos}/listar/estado?pEstado=${pEstado}`);
  }


  getEventoVenta(idEvento:string){
      return this.http.get<any>(`${this.apiEventos}/venta/${idEvento}`);
  }


  getAllEventosFiltro( pIdCiudad: number, pTexto: string, pTipo: string) {
    const url = `${this.apiEventos}/filtro/${pIdCiudad}/${pTexto}/${pTipo}`;
    return this.http.get<any>(url);
  }




}
