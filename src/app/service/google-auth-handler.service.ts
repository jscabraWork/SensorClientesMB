import { Injectable } from '@angular/core';
import { AuthService } from './seguridad/auth.service';
import { UsuariosDataService } from './data/usuarios-data.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MensajeComponent } from '../components/mensaje/mensaje.component';
import { RegistrarseComponent } from '../components/registrarse/registrarse.component';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthHandlerService {

  constructor(
    private auth: AuthService,
    private usuariosService: UsuariosDataService,
    private dialog: MatDialog
  ) { }

  /**
   * Detecta y maneja tokens de Google OAuth desde cualquier URL
   */
  handleOAuthTokensFromUrl(route: ActivatedRoute): void {
    route.queryParams.subscribe(params => {
      if (params['regToken']) {
        this.handleGoogleRegister(params['regToken']);
      } else if (params['logToken']) {
        this.handleGoogleLogin(params['logToken']);
      } else if (params['error']) {
        this.openMensaje('Error en el login con Google. Intente nuevamente.');
      }
    });
  }
private handleGoogleRegister(regToken: string): void {
    this.auth.validateRegistrationGoogleToken(regToken).subscribe({
      next: googleData => this.abrirRegistroConGoogle(googleData),
      error: () => {
        this.openMensaje('Error procesando registro con Google');
        this.limpiarParametrosUrl();
      }
    });
  }

  private handleGoogleLogin(regToken: string): void {
    this.auth.validateLoginGoogleToken(regToken).subscribe({
      next: response => {

        if (response.action === 'ASSOCIATE_GOOGLE') {
          this.handleGoogleAssociation(response);
          return;
        }

        this.auth.googleLogin(response.idToken).subscribe({
          next: loginResponse => {
            this.auth.guardarUsuario(loginResponse.accessToken);
            this.auth.guardarToken(loginResponse.accessToken);
            
            // Mostrar mensaje de bienvenida sin redirigir
            const nombreUsuario = this.auth.usuario.nombre || this.auth.usuario.usuario;
            const dialogRef = this.dialog.open(MensajeComponent, {
              width: '500px',
              maxWidth: '80vw',
              height: 'auto',
              data: {
                mensaje: `Bienvenido de vuelta ${nombreUsuario}`
              }
            });
            
            dialogRef.afterClosed().subscribe(() => {
              // Solo limpiar los parámetros OAuth de la URL, mantener otros parámetros
              this.limpiarParametrosUrl();
              // Recargar la página para que el componente detecte el nuevo estado de autenticación
              window.location.reload();
            });
          },
          error: (error) => {
            console.error('Error in googleLogin call:', error);
            this.openMensaje('Error en el login con Google.');
            this.limpiarParametrosUrl();
          }
        });
      },
      error: () => {
        this.openMensaje('Error validando token con Google.');
        this.limpiarParametrosUrl();
      }
    });
  }

  private abrirRegistroConGoogle(googleData: any): void {
    this.dialog.closeAll();
    setTimeout(() => {
      const dialogRef = this.dialog.open(RegistrarseComponent, {
        width: '600px',
        height: 'auto',
        data: { googleData }
      });
      dialogRef.afterClosed().subscribe((result) => {
        // Solo hacer autologin si el registro fue exitoso (result = true)
        if (result === true) {
          // Después de cerrar el registro, hacer login automático con el idToken de Google
          this.auth.googleLogin(googleData.idToken).subscribe({
            next: loginResponse => {
              this.auth.guardarUsuario(loginResponse.accessToken);
              this.auth.guardarToken(loginResponse.accessToken);

              const nombreUsuario = this.auth.usuario.nombre || this.auth.usuario.usuario;
              const dialogRef = this.dialog.open(MensajeComponent, {
                width: '500px',
                maxWidth: '80vw',
                height: 'auto',
                data: {
                  mensaje: `¡Bienvenido ${nombreUsuario}! Tu cuenta ha sido creada exitosamente.`
                }
              });

              dialogRef.afterClosed().subscribe(() => {
                this.limpiarParametrosUrl();
                window.location.reload();
              });
            },
            error: () => {
              this.openMensaje('Error en el login automático. Por favor inicia sesión manualmente.');
              this.limpiarParametrosUrl();
            }
          });
        } else {
          // Si se cerró sin completar el registro, solo limpiar y volver al home
          this.limpiarParametrosUrl();
          window.location.href = '/home';
        }
      });
    }, 100);
  }

  private handleGoogleAssociation(response: any): void {
    const correo = response.correo;
    const accessToken = response.accessToken
    const googleId = response.googleId
    const idToken = response.idToken

    this.usuariosService.asociarGoogle(correo, googleId, accessToken).subscribe({
      next: () => {
        // Auto-login después de la asociación exitosa
        this.auth.googleLogin(idToken).subscribe({
          next: loginResponse => {
            this.auth.guardarUsuario(loginResponse.accessToken);
            this.auth.guardarToken(loginResponse.accessToken);
            
            const dialogRef = this.dialog.open(MensajeComponent, {
              width: '500px',
              maxWidth: '80vw',
              height: 'auto',
              data: {
                mensaje: 'Tu cuenta de Google fue asociada correctamente con tu cuenta en Sensor Events!'
              }
            });
            
            dialogRef.afterClosed().subscribe(() => {
              this.limpiarParametrosUrl();
              window.location.reload();
            });
          },
          error: () => {
            this.openMensaje('Asociación exitosa. Por favor inicia sesión nuevamente.');
            this.limpiarParametrosUrl();
          }
        });
      },
      error: error => {
        console.error('Error en asociación:', error);
        this.openMensaje('Error al asociar cuenta de Google. Intente nuevamente.');
        this.limpiarParametrosUrl();
      }
    });
  }

  private openMensaje(mensajeT: string): void {
    let screenWidth = screen.width;
    let anchoDialog: string = '500px';
    let anchomax: string = '80vw';
    let altoDialog: string = '250';
    if (screenWidth <= 600) {
      anchoDialog = '100%';
      anchomax = '100%';
      altoDialog = 'auto';
    }
    this.dialog.open(MensajeComponent, {
      width: anchoDialog,
      maxWidth: anchomax,
      height: altoDialog,
      data: {
        mensaje: mensajeT
      }
    });
  }

  /**
   * Limpia los parámetros de OAuth de la URL sin afectar otros parámetros
   */
  private limpiarParametrosUrl(): void {
    const url = new URL(window.location.href);
    url.searchParams.delete('logToken');
    url.searchParams.delete('regToken');
    url.searchParams.delete('error');
    url.searchParams.delete('originalUrl');
    
    // Actualizar la URL sin recargar la página
    window.history.replaceState({}, document.title, url.toString());
  }
}
