import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL_PAGOS } from '../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class TraspasoDataService {

  private baseEndpoint = `${API_URL_PAGOS}/ordenes-traspaso`;

  constructor(private http: HttpClient) { }

  transferirTicket(ticketId: number, correo: string): Observable<any> {
    return this.http.post(`${this.baseEndpoint}/transferir/${ticketId}?correo=${encodeURIComponent(correo)}`,{},);
  }

  confirmarTransferenciaTicket(codigo: string): Observable<any> {
    return this.http.post(`${this.baseEndpoint}/confirmar-traspaso/${codigo}`,{},);
  }
}
