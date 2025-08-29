import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {  API_URL_AUTH, API_URL_USUARIOS } from '../../app.constants';
import { Md5 } from 'ts-md5';
import { Usuario } from '../usuario.model';
import { MensajeComponent } from '../../components/mensaje/mensaje.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _usuario: Usuario;
  private _token: string;


  constructor(private http: HttpClient, private dialog: MatDialog, private router: Router) { }

  // Método para guardar la URL antes de redirigir al login
  setRedirectUrl(url: string): void {
    sessionStorage.setItem('redirectUrl', url);
  }

  // Método para obtener la URL de redirección
  getRedirectUrl(): string {
    return sessionStorage.getItem('redirectUrl') || '/home';
  }

  // Método para limpiar la URL de redirección
  clearRedirectUrl(): void {
    sessionStorage.removeItem('redirectUrl');
  }


  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (
      this._usuario == null &&
      sessionStorage.getItem('usuario') != null
    ) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    } else if (this._token == null && localStorage.getItem('tempSession') != null) {
      const tempSession = localStorage.getItem('tempSession');
      const sessionData = JSON.parse(tempSession);
      if (sessionData && sessionData.token) {
        this._token = sessionData.token;
        return this._token;
      }
    }
    return null;
  }


  login(usuario: Usuario): Observable<any> {
    const urlEndPoint = API_URL_AUTH + '/oauth/token';

    const credenciales = btoa('alltickets.front' + ':' + 'l!Uq!Ujhfzyjd%Mk*a6H');

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + credenciales,
    });

    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.correo);
    var md5 = new Md5();

    var contra = md5.appendStr(usuario.contrasena).end().toString();

    params.set('password', contra);

    return this.http.post<any>(urlEndPoint, params.toString(), {
      headers: httpHeaders,
    });
  }

  guardarUsuario(accessToken: string): void {
    let objeto = this.obtenerDatosDelTocken(accessToken);
    this._usuario = new Usuario();
    this._usuario.nombre = objeto.nombre;

    this._usuario.usuario = objeto.user_name;

    this._usuario.roles = objeto.authorities;

    this._usuario.numeroDocumento =objeto.cc
    

    this._usuario.roles.forEach(r=>{
      if(r=="ROLE_CLIENTE"){
        this._usuario.tipo='usuario'
      }
      else if(r=="ROLE_PROMOTOR"){
        this._usuario.tipo='promotor'
      }
    })

    if (this._usuario.tipo == 'usuario') {
      sessionStorage.setItem('usuario', this._usuario.usuario);
      sessionStorage.setItem('cc', this._usuario.numeroDocumento); 
      sessionStorage.setItem('usuarioEntidad', JSON.stringify(this._usuario));
      this.dialog.closeAll();
      
      // Redirigir a la URL guardada o a /home por defecto
      const redirectUrl = this.getRedirectUrl();
      this.clearRedirectUrl();
      this.router.navigate([redirectUrl]);

    } else if (this._usuario.tipo == 'promotor') {
      this.openMensaje('<p>Nos hemos actualizado, para realizar tus ventas por favor ingresar a:  <a style="color:#ed701c;" href="https://promotores.allticketscol.com"> https://organizadores.allticketscol.com</a> </p>')
    }
    else{
      this.openMensaje('<p>Nos hemos actualizado, para realizar tus consultas por favor ingresar a:  <a style="color:#ed701c;" href="https://organizadores.allticketscol.com"> https://organizadores.allticketscol.com</a> </p>')
    }

  }

  guardarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
    
  }

  obtenerDatosDelTocken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split('.')[1]));
    } else {
      return null;
    }
  }

  isAuthenticated(): boolean {
    let payload = this.obtenerDatosDelTocken(this.token);
    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    return false;
  }

  hasRole(role: string): boolean {
    if (
      this.usuario.roles != undefined &&
      this.usuario.roles.length > 0 &&
      this.usuario.roles.includes(role)
    ) {
      return true;
    }
    return false;
  }

  logout(): void {
    this._token = null;
    this._usuario = null;

    // Limpiar sessionStorage
    sessionStorage.clear();
    sessionStorage.removeItem('usuarioEntidad');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('promotor');
    sessionStorage.removeItem('cc');
    sessionStorage.removeItem('redirectUrl');

    // Limpiar también localStorage de sesiones temporales
    localStorage.removeItem('tempSession');
  }

  guardarSesionEnLocalStorage(): void {
    const sessionData = {
      token: sessionStorage.getItem('token'),
      usuario: sessionStorage.getItem('usuario'),
      usuarioEntidad: sessionStorage.getItem('usuarioEntidad'),
      cc: sessionStorage.getItem('cc'),
      timestamp: Date.now()
    };
    
    if (sessionData.token && sessionData.usuario) {
      localStorage.setItem('tempSession', JSON.stringify(sessionData));
    }
  }

  //Carga la session desde el localstoreage y luego lo elimina, es asíncrono
  async cargarSesionDesdeLocalStorage(): Promise<void> {
    const tempSession = localStorage.getItem('tempSession');
    if (tempSession) {
      try {
        const sessionData = JSON.parse(tempSession);
        
        // Validar que los datos requeridos existan
        if (sessionData.token && sessionData.usuario && sessionData.usuarioEntidad) {
          // Opcional: Validar que la sesión no sea muy antigua (ej: 24 horas)
          const maxAge = 24 * 60 * 60 * 1000; // 24 horas en millisegundos
          if (sessionData.timestamp && (Date.now() - sessionData.timestamp) > maxAge) {
            localStorage.removeItem('tempSession');
            return;
          }
          
          // Restaurar datos en sessionStorage
          sessionStorage.setItem('token', sessionData.token);
          sessionStorage.setItem('usuario', sessionData.usuario);
          sessionStorage.setItem('usuarioEntidad', sessionData.usuarioEntidad);
          if (sessionData.cc) {
            sessionStorage.setItem('cc', sessionData.cc);
          }
          
          // Actualizar variables privadas
          this._token = sessionData.token;
          this._usuario = JSON.parse(sessionData.usuarioEntidad);
          
          // Limpiar localStorage después de restaurar
          localStorage.removeItem('tempSession');
        }
      } catch (error) {
        // Si hay error al parsear, limpiar localStorage
        console.error('Error al cargar sesión desde localStorage:', error);
        localStorage.removeItem('tempSession');
      }
    }
  }

  openMensaje(mensajeT:string,openD?:string):void{
    let screenWidth = screen.width;
    let anchoDialog:string = '500px';
    let anchomax:string = '80vw';
    let altoDialog:string = '250';
    if(screenWidth<=600){
      anchoDialog = '100%';
      anchomax = '100%';
      altoDialog = 'auto';
    }
    const dialogRef = this.dialog.open(MensajeComponent, {
      width: anchoDialog,
      maxWidth: anchomax,
      height: altoDialog,
      data:{
        mensaje:mensajeT
      }
    });
  }
}