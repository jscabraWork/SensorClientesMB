import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonDataService } from '../commons/common-data.service';
import { Alcancia } from '../../models/alcancia.model';
import { API_URL_PAGOS } from '../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class AlcanciasDataService extends CommonDataService<Alcancia>{

  protected override baseEndpoint=`${API_URL_PAGOS}/alcancias`;

  protected override atributoListado =`cliente`;

  constructor(protected override http:HttpClient) { super(http)}
}
