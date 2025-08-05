import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL_USUARIOS } from '../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class RecuperacionDataService {

  private apiUsuarios=`${API_URL_USUARIOS}`;

  constructor(private http: HttpClient) { }

  
  olvidoContrasenia(pIdBusqueda:string){
    return this.http.get<any>(`${API_URL_USUARIOS}/recuperar-contrasena/${pIdBusqueda}`)
  }

    
  cambiarContrasena(pIdBusqueda:string, contrasena:string){
    return this.http.put<any>(`${API_URL_USUARIOS}/recuperar-contrasena/${pIdBusqueda}`,contrasena)
  }
}
