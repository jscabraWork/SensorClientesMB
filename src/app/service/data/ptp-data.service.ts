import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL_PAGOS, respuesta } from '../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class PtpDataService {

  apiPagos=API_URL_PAGOS+"/ptp"

  constructor(private http: HttpClient) { }

  getPeticionPTP(idOrden: number, seguro: boolean, aporteAlcancia?: number){

    let url = respuesta +"/eventos/respuesta/"+idOrden;

    const formData: FormData= new FormData();
    formData.append('idOrden', idOrden.toString());
    formData.append('url', url);
    formData.append('seguro', seguro.toString());
    
    if (aporteAlcancia !== undefined && aporteAlcancia !== null) {
      formData.append('aporteAlcancia', aporteAlcancia.toString());
    }

    return this.http.post<any>(`${this.apiPagos}/crear-link`, formData);

  }
}
