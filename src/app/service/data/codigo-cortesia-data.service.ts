import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  API_URL_PAGOS } from '../../app.constants';
import { CommonDataService } from '../commons/common-data.service';


@Injectable({
  providedIn: 'root'
})
export class CodigoCortesiaDataService {

  apiCodigoCortesias = `${API_URL_PAGOS}/cortesias`
  
  constructor(private http: HttpClient) { }
  
  public findById(pId) {
    return this.http.get<any>(`${this.apiCodigoCortesias}/${pId}`);
  }




}
