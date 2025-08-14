import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonDataService } from '../commons/common-data.service';
import { Alcancia } from '../../models/alcancia.model';
import { MisAlcanciasDto } from '../../models/misalcancias.model';
import { API_URL_PAGOS } from '../../app.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlcanciasDataService extends CommonDataService<Alcancia>{

  protected override baseEndpoint=`${API_URL_PAGOS}/alcancias`;
  protected baseEndpointClientes=`${API_URL_PAGOS}/clientes`;

  protected override atributoListado =`cliente`;

  constructor(protected override http:HttpClient) { super(http)}

  getMisAlcanciasByCliente(numeroDocumento: string): Observable<MisAlcanciasDto[]> {
    return this.http.get<MisAlcanciasDto[]>(`${this.baseEndpointClientes}/mis-alcancias/${numeroDocumento}`);
  }
}
