import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cupon } from '../../models/cupon.model';
import { API_URL_PAGOS } from '../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class CuponDataService {

  apiParticularidades = `${API_URL_PAGOS}/cupones`

  constructor(private http:HttpClient) { }


  validarCupon(pCodigoVenta,pIdLocalidad, pCantidad){
    return this.http.get(`${this.apiParticularidades}/localidad/${pIdLocalidad}/valido/${pCodigoVenta}/cantidad/${pCantidad}`)
  }

  
}
