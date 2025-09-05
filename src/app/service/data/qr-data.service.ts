import { Injectable } from '@angular/core';
import { API_URL_PAGOS } from '../../app.constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QrDataService {

  private apiQR=`${API_URL_PAGOS}/qr`;
  constructor(private http: HttpClient) { }

  enviarQR(ticketId: number): Observable<any> {
    return this.http.put(`${this.apiQR}/enviar/${ticketId}`, {});
  }

}
