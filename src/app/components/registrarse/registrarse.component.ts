import { Component, OnInit, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Md5 } from 'ts-md5';

import { UsuariosDataService } from '../../service/data/usuarios-data.service'; 
import { Cliente } from './../usuario/cliente.model';
import { Codigo, TipoDocumento } from '../../models/codigo.model';
import { MensajeComponent } from '../mensaje/mensaje.component';
import { AuthService } from '../../service/seguridad/auth.service';

@Component({
  selector: 'app-registrarse',
  standalone: true,
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatDialogModule,
  ]
})
export class RegistrarseComponent implements OnInit {
  usuario: Codigo;
  confimarcionCorreo: string;
  confimarcionDocumento: any;
  aceptoTerminos: boolean;
  isLoading = false;
  isGoogleRegistration = false;
  googleData: any = null;
  cargando: boolean = false;
  mostrarPassword: boolean = false;

  tiposDocumento: TipoDocumento[] = [
    { id: 1, nombre: 'Cedula de Ciudadania' },
    { id: 2, nombre: 'Pasaporte' },
    { id: 3, nombre: 'Cedula de Extranjeria' },
    { id: 4, nombre: 'Interno' },
    { id: 5, nombre: 'Tarjeta de Identidad' }
  ];

  constructor(
    private service: UsuariosDataService,
    private auth: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<RegistrarseComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.googleData) {
      this.googleData = data.googleData;
      this.isGoogleRegistration = true;
    }
  }

  ngOnInit(): void {
    this.mostrarPassword = false;
    this.confimarcionCorreo = '';
    this.confimarcionDocumento = null;
    this.aceptoTerminos = false;
    this.usuario = new Codigo();
    this.usuario.tipoDocumento = this.tiposDocumento[0];

    // Si es registro con Google, prellenar los datos
    if (this.isGoogleRegistration && this.googleData) {
      this.usuario.correo = this.googleData.correo;
      this.usuario.nombre = this.googleData.nombre;
      this.confimarcionCorreo = this.googleData.correo;
    }

    this.function();
  }

  validateEmail() {
    const emailField = document.getElementById('email') as HTMLInputElement;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(this.usuario.correo)) {
      emailField.style.borderColor = '#666';
      emailField.style.background = 'linear-gradient(145deg, #2f2f2f, #1f1f1f)';
    } else {
      emailField.style.borderColor = '#ff6b6b';
      emailField.style.background = 'linear-gradient(145deg, #3a2222, #2a1a1a)';
    }
  }

  saveUsuario() {
    this.cargando = true;
    this.isLoading = true;

    if (!this.usuario.correo.includes(' ')) {
      if (this.aceptoTerminos) {
        if (this.confimarcionCorreo === this.usuario.correo) {
          if (this.confimarcionDocumento === this.usuario.numeroDocumento) {
              if (
                !this.usuario.numeroDocumento.includes(' ') &&
                !this.usuario.numeroDocumento.includes('.')
              ) {
                if (this.isGoogleRegistration && this.googleData) {
                  // Crear objeto plano para evitar problemas de serialización
                  const usuarioData = {
                    nombre: this.usuario.nombre,
                    correo: this.usuario.correo,
                    numeroDocumento: this.usuario.numeroDocumento,
                    tipoDocumento: this.usuario.tipoDocumento,
                    celular: this.usuario.celular,
                    contrasena: this.usuario.contrasena,
                    publicidad: this.usuario.publicidad,
                    activo: true
                  };

                  this.service.registroGoogle(
                    usuarioData,
                    this.googleData.googleId,
                    this.googleData.accessToken,
                    this.googleData.refreshToken
                  ).subscribe({
                    next: (response) => {
                      this.cargando = false;
                      this.isLoading = false;
                      if (response.mensaje === 'Los datos provisionados ya se encuentran registrados') {
                        this.openMensaje(response.mensaje);
                        this.usuario.contrasena = '';
                      } else {
                        // Auto-login después del registro exitoso con Google
                        if (response.access_token) {
                          this.auth.guardarUsuario(response.access_token);
                          this.auth.guardarToken(response.access_token);

                          // Mostrar mensaje y recargar cuando cierren el diálogo
                          const dialogRef = this.dialog.open(MensajeComponent, {
                            width: '500px',
                            maxWidth: '80vw',
                            height: 'auto',
                            data: {
                              mensaje: response.mensaje
                            }
                          });

                          dialogRef.afterClosed().subscribe(() => {
                            window.location.href = '/home';
                          });
                        } else {
                          // Mostrar mensaje de registro exitoso sin token
                          const dialogRef = this.dialog.open(MensajeComponent, {
                            width: '500px',
                            maxWidth: '80vw',
                            height: 'auto',
                            data: {
                              mensaje: response.mensaje
                            }
                          });

                          dialogRef.afterClosed().subscribe(() => {
                            this.dialog.closeAll();
                          });
                        }
                      }
                    },
                    error: (error) => {
                      this.cargando = false;
                      this.isLoading = false;
                      console.error('Error en registro Google:', error);
                      this.openMensaje('Error en el registro: ' + (error.error?.mensaje || error.message || 'Error desconocido'));
                      this.usuario.contrasena = '';
                    }
                  });
                } else {
                  // Registro normal - hashear contraseña con MD5
                  const md5 = new Md5();
                  const contra = this.usuario.contrasena;
                  this.usuario.contrasena = md5.appendStr(contra).end().toString();

                  this.service.createCliente(this.usuario).subscribe({
                    next: (response) => {
                      this.cargando = false;
                      this.isLoading = false;
                      if (response.mensaje === 'Los datos provisionados ya se encuentran registrados') {
                        this.openMensaje(response.mensaje);
                        this.usuario.contrasena = '';
                      } else {
                        // Auto-login después del registro exitoso normal
                        if (response.access_token) {
                          this.auth.guardarUsuario(response.access_token);
                          this.auth.guardarToken(response.access_token);

                          // Mostrar mensaje y recargar cuando cierren el diálogo
                          const dialogRef = this.dialog.open(MensajeComponent, {
                            width: '500px',
                            maxWidth: '80vw',
                            height: 'auto',
                            data: {
                              mensaje: response.mensaje
                            }
                          });

                          dialogRef.afterClosed().subscribe(() => {
                            window.location.href = '/home';
                          });
                        } else {
                          this.openMensaje(response.mensaje, 'closeAll');
                        }
                      }
                    },
                    error: () => {
                      this.cargando = false;
                      this.isLoading = false;
                      this.usuario.contrasena = '';
                      this.openMensaje('Por favor verifica los datos ingresados, si el problema persiste contacta con el administrador del sistema');
                    }
                  });
                }
              } else {
                this.cargando = false;
                this.isLoading = false;
                this.openMensaje('El número de documento no puede contener espacios ni puntos');
              }
            } else {
              this.cargando = false;
              this.isLoading = false;
              this.openMensaje('Verifica el número de documento');
            }
        } else {
          this.cargando = false;
          this.isLoading = false;
          this.openMensaje('Verifica el correo');
        }
      } else {
        this.cargando = false;
        this.isLoading = false;
        this.openMensaje('Debes aceptar términos y condiciones');
      }
    } else {
      this.cargando = false;
      this.isLoading = false;
      this.openMensaje('El correo no permite espacios en blanco');
    }
  }

  function() {
    const inputs = ['bloquear', 'bloquear2'];
    inputs.forEach((id) => {
      const input = document.getElementById(id);
      if (input) {
        input.onpaste = (e) => {
          e.preventDefault();
          alert('esta acción está prohibida');
        };
        input.oncopy = (e) => {
          e.preventDefault();
          alert('esta acción está prohibida');
        };
      }
    });
  }

  aceptarTerminos() {
    this.aceptoTerminos = !this.aceptoTerminos;
  }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  publicidad() {
    if (this.usuario.publicidad) {
      this.usuario.publicidad = false;
    } else {
      this.usuario.publicidad = true;
    }
  }

  onTipoDocumentoChange(event: any) {
    const tipoId = parseInt(event.target.value);
    this.usuario.tipoDocumento = this.tiposDocumento.find(tipo => tipo.id === tipoId) || this.tiposDocumento[0];
  }

  cerrarModal() {
    this.dialogRef.close();
  }

  registrarseConGoogle(): void {
    this.auth.loginWithGoogle();
  }

  openMensaje(mensajeT: string, openD?: string): void {
    let screenWidth = screen.width;
    let anchoDialog: string = '500px';
    let anchomax: string = '80vw';
    let altoDialog: string = '250';
    if (screenWidth <= 600) {
      anchoDialog = '100%';
      anchomax = '100%';
      altoDialog = 'auto';
    }
    const dialogRef = this.dialog.open(MensajeComponent, {
      width: anchoDialog,
      maxWidth: anchomax,
      height: altoDialog,
      data: {
        mensaje: mensajeT
      }
    });
    if (openD === 'closeAll') {
      dialogRef.afterClosed().subscribe(() => {
        this.dialog.closeAll();
      });
    }
  }
}
