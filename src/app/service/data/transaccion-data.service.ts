import { Injectable } from '@angular/core';
import { API_URL_PAGOS } from '../../app.constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransaccionDataService {

  private apiTransacciones = `${API_URL_PAGOS}/transaccion`;

  constructor(private http: HttpClient) { }

   verificarTransaccionEnProceso(ordenId: number): Observable<any> {
    return this.http.get(`${this.apiTransacciones}/verificar-transacciones/${ordenId}`);
  }
}
