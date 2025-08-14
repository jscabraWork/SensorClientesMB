import { Injectable } from '@angular/core';
import {  API_URL_PAGOS } from '../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class AdicionalesDataService {

apiAdicionales = `${API_URL_PAGOS}/adicionales`

  constructor() { }
  
	
}
