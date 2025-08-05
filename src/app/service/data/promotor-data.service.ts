import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL_PROMOTORES} from '../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class PromotorDataService{

  constructor(protected http: HttpClient) {
   }

private baseEndpoint = API_URL_PROMOTORES +"/todosPromotores"

getPorId(pId)
  {
    return this.http.get<any>((`${this.baseEndpoint}/${pId}/promotor`)); 
  }
 
}
