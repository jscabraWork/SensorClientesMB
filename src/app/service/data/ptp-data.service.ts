import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL_PAGOS, respuesta } from '../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class PtpDataService {

  apiPagos=API_URL_PAGOS+"/ptp"

  constructor(private http: HttpClient) { }

  getPeticionPTP(idOrden,valorTotal,descripcion:string,tax,seguro){

    let url = respuesta +"/eventos/respuesta/"+idOrden;

    const formData: FormData= new FormData();
    formData.append('idOrden', idOrden);
    formData.append('valorTotal',valorTotal);
    formData.append('descripcion',descripcion);
    formData.append('url',url);
    formData.append('tax',tax);
    formData.append('seguro',seguro);

    return this.http.post<any>(`${this.apiPagos}/crear-link`, formData);

  }
}
