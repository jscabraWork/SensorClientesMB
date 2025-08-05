import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  API_URL_PROMOTORES } from '../../app.constants';


@Injectable({
  providedIn: 'root'
})
export class ReservasBoletasService {

  constructor(private http: HttpClient) { }



  getReservaPorId(pIdReserva){
    return this.http.get<any>(`${API_URL_PROMOTORES}/reservas/${pIdReserva}`)
  }
}
