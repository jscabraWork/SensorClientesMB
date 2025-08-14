import { Injectable } from '@angular/core';
import {  API_URL_PAGOS } from '../../app.constants';


@Injectable({
  providedIn: 'root'
})
export class CodigoCortesiaDataService {

  apiCodigoCortesias = `${API_URL_PAGOS}/cortesias`
  
  constructor() { }
  




}
