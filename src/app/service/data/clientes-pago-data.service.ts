import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  API_URL_PAGOS } from '../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class ClientesPagoDataService {

  private apiPagos=`${API_URL_PAGOS}/clientes`;

  constructor(private http: HttpClient) { }


  getClientePago(usuario:string){
    return this.http.get<any>(`${this.apiPagos}/usuario/${usuario}`);
  }

  getCliente(numeroDocumento:string){
    return this.http.get<any>(`${this.apiPagos}/${numeroDocumento}`)
  }
}
