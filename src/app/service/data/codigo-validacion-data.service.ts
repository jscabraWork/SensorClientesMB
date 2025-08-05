import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL_USUARIOS } from '../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class CodigoValidacionDataService {


  private apiUsuarios=`${API_URL_USUARIOS}`;

  constructor(private http: HttpClient) { }

  crearUsuarioDesdeCodigo(idBusqueda){
    return this.http.get<any>(`${this.apiUsuarios}/crear-usuario/${idBusqueda}`)
  }
}
