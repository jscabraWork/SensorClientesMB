import {  API_URL_PAGOS } from './../../app.constants';
import { Evento } from '../../components/eventos/evento.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class EventoDataService {

  constructor(private http: HttpClient) { }

  apiEventos=`${API_URL_PAGOS}/eventos`
  apiEventos2=`${API_URL_PAGOS}`

  getById(pIdEvento){
    return this.http.get<Evento>(`${this.apiEventos}/${pIdEvento}`);
  }

  getAllEventosVisibles(){
    return this.http.get<Evento[]>(`${this.apiEventos}/estado`);
  }
  getEventoIdPerfil(pIdEvento){
    return this.http.get(`${this.apiEventos}/${pIdEvento}/estado`);
  }

  getEventoIdPerfilNoSoldOut(pIdEvento:string){
    return this.http.get(`${this.apiEventos}/${pIdEvento}/localidad`);
  }

  getEventoPorLocalidadId(pIdLocalidad:number){
    return this.http.get(`${this.apiEventos2}/localidades/localidad/${pIdLocalidad}/evento`);
  }

  getEventoIdPerfilPulep(pIdEvento:string){
    return this.http.get(`${this.apiEventos}/pulep/${pIdEvento}`);
  }

  getAllEventosFiltro( pIdCiudad: number, pTexto: string, pTipo: string) {
    const url = `${this.apiEventos}/filtro/${pIdCiudad}/${pTexto}/${pTipo}`;
    return this.http.get<any>(url);
  }

  getEventoId(pIdEvento){
    return this.http.get<any>(`${this.apiEventos}/${pIdEvento}/perfil`);
  }

  getEtapasByEventoIdAndEstado(pIdEvento, pEstado){
    return this.http.get<any>(`${API_URL_PAGOS}/etapas/${pIdEvento}/estado/${pEstado}`);
  }


  getLocalidadesByEtapaEstaoAndEvento(pIdEvento, pEstado){
    return this.http.get<any>(`${API_URL_PAGOS}/localidades/estado/${pEstado}/evento/${pIdEvento}`);
  }



}
