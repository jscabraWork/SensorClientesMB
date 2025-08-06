import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Md5 } from 'ts-md5';

import { RecuperacionDataService } from '../../service/data/recuperacion-data.service';
import { MensajeComponent } from '../mensaje/mensaje.component';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatDialogModule
  ]
})
export class RecuperarContrasenaComponent implements OnInit {
  valido: boolean = false;
  contrasena: string = '';
  contrasenaConfirmar: string = '';
  id: string | null = null;
  errorMessage: string = '';

  constructor(
    private service: RecuperacionDataService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.service.olvidoContrasenia(this.id).subscribe({
          next: response => {
            this.valido = response.valido;
          },
          error: error => {
            this.valido = false;
            this.openMensaje('El enlace de recuperación no es válido o ha expirado');
          }
        });
      }
    });
  }

  saveContrasena() {
    // Reset error message
    this.errorMessage = '';

    // Validation
    if (this.contrasena !== this.contrasenaConfirmar) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (this.contrasena && this.contrasena.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (this.contrasena === this.contrasenaConfirmar && this.contrasena) {
      const md5 = new Md5();
      const contrasenaFinal = md5.appendStr(this.contrasena).end().toString();
      
      this.service.cambiarContrasena(this.id!, contrasenaFinal).subscribe({
        next: response => {
          if (response.valido) {
            this.openMensaje('Contraseña exitosamente cambiada');
          } else {
            this.openMensaje('No se pudo realizar el proceso, por favor vuelva a solicitar la recuperación de contraseña');
          }
          this.router.navigate(['/home']);
        },
        error: error => {
          this.openMensaje('No se pudo realizar el proceso, por favor vuelva a solicitar la recuperación de contraseña');
        }
      });
    } else {
      this.errorMessage = 'Las contraseñas deben coincidir y no pueden estar vacías';
    }
  }

  validatePassword() {
    const passwordField = document.getElementById('new-password') as HTMLInputElement;
    const confirmField = document.getElementById('confirm-password') as HTMLInputElement;
    
    if (this.contrasena && this.contrasena.length >= 6) {
      if (passwordField) {
        passwordField.style.borderColor = '#666';
        passwordField.style.background = 'linear-gradient(145deg, #2f2f2f, #1f1f1f)';
      }
    } else if (this.contrasena) {
      if (passwordField) {
        passwordField.style.borderColor = '#ff6b6b';
        passwordField.style.background = 'linear-gradient(145deg, #3a2222, #2a1a1a)';
      }
    }
    
    if (this.contrasena && this.contrasenaConfirmar && this.contrasena === this.contrasenaConfirmar) {
      if (confirmField) {
        confirmField.style.borderColor = '#666';
        confirmField.style.background = 'linear-gradient(145deg, #2f2f2f, #1f1f1f)';
      }
    } else if (this.contrasenaConfirmar) {
      if (confirmField) {
        confirmField.style.borderColor = '#ff6b6b';
        confirmField.style.background = 'linear-gradient(145deg, #3a2222, #2a1a1a)';
      }
    }
  }

  openMensaje(mensajeT: string): void {
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
  }
}