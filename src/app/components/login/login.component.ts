import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { AuthService } from '../../service/seguridad/auth.service';
import { Usuario } from '../../service/usuario.model';
import { MensajeComponent } from '../mensaje/mensaje.component';
import { OlvidoComponent } from '../olvido/olvido.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  usuario: Usuario
  errorMessage = "Invalid credentials";
  invalidLogin = false;
  isLoading = false;

  constructor(
    public dialog: MatDialog,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usuario = new Usuario();
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

  handleLogin() {
    if(this.usuario.correo == null || this.usuario.contrasena == null){
      this.openMensaje('Username o Password vacios');
      return;
    }

    this.isLoading = true;
    this.auth.logout();
    this.usuario.correo = this.usuario.correo.trim();

    this.auth.login(this.usuario).subscribe({
      next: response => {
        this.auth.guardarUsuario(response.access_token);
        this.auth.guardarToken(response.access_token);

        let usuario = this.auth.usuario;
        this.auth.guardarSesionEnLocalStorage();

        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;
        if(error.status == 400){
          this.openMensaje('Usuario o clave incorrectos');
        }
        this.usuario = new Usuario();
        this.invalidLogin = true;
      }
    });
  }

  olvidoContrasenia() {
    const dialogRef = this.dialog.open(OlvidoComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle result if needed
    });
  }

  openDialog(): void {
    this.router.navigate(['registrarse'])
  }

  openMensaje(mensajeT: string, openD?: string): void {
    let screenWidth = screen.width;
    let anchoDialog: string = '500px';
    let anchomax: string = '80vw';
    let altoDialog: string = '250';
    if(screenWidth <= 600){
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
  }
}
