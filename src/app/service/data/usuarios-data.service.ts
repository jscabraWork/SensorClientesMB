import { Cliente } from '../../components/usuario/cliente.model';
import { API_URL_USUARIOS} from './../../app.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuariosDataService {

  apiUsuarios=`${API_URL_USUARIOS}`;



  constructor(private http: HttpClient) { }



  createCliente(usuario):Observable<any>{
    return this.http.post(`${this.apiUsuarios}/registro`,usuario).pipe(
      catchError(e=>{
   
        alert( `${e.error.mensaje} ${e.error.error}`);
        return throwError(e);})
    );
  }
  
  getCliente(usuario:string){
    return this.http.get<any>(`${API_URL_USUARIOS}/login/${usuario}`);
  }

  public editar(e:Cliente): Observable<any>{
  
    return this.http.put(`${API_URL_USUARIOS}/cliente`,e )
    
  }

  olvidoContrasenia(correo:string){
    return this.http.post(`${API_URL_USUARIOS}/recuperar-contrasena/${correo}`,null)
  }
  

}
