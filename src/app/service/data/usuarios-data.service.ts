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

  asociarGoogle(correo: string, googleId: string, accessToken: string): Observable<any> {
    const params = new URLSearchParams();
    params.set('correo', correo);
    params.set('providerId', googleId);
    params.set('accessToken', accessToken);
    params.set('tipoProvider', '0'); // 0 = Google

    return this.http.post<any>(`${this.apiUsuarios}/asociar-provider?${params.toString()}`, null);
  }
  
  registroGoogle(usuario: any, googleId: string, accessToken: string, refreshToken: string): Observable<any> {
    const params = new URLSearchParams();
    params.set('tipoProvider', '0'); // 0 = Google
    params.set('providerId', googleId);
    params.set('accessToken', accessToken);
    if (refreshToken) {
      params.set('refreshToken', refreshToken);
    }

    const url = `${this.apiUsuarios}/registro-provider?${params.toString()}`;
    return this.http.post<any>(url, usuario);
  }

}
