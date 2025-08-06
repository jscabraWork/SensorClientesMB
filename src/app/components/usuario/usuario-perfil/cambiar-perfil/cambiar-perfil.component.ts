import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Md5 } from 'ts-md5';

import { UsuariosDataService } from '../../../../service/data/usuarios-data.service';
import { HardcodedAutheticationService } from '../../../../service/hardcoded-authetication.service';
import { Cliente } from '../../cliente.model';
import { MensajeComponent } from '../../../mensaje/mensaje.component';

@Component({
  selector: 'app-cambiar-perfil',
  standalone: true,
  templateUrl: './cambiar-perfil.component.html',
  styleUrls: ['./cambiar-perfil.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatDialogModule,
    MatIconModule
  ]
})
export class CambiarPerfilComponent implements OnInit {
  usuario: Cliente = new Cliente();
  originalPassword: string = '';
  cargando: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataServicio: UsuariosDataService,
    private dialog: MatDialog,
    public autenticador: HardcodedAutheticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = new Cliente();
    this.originalPassword = this.data.usuario.contrasena;
    this.usuario = { ...this.data.usuario }; // Create a copy to avoid direct mutation
  }

  saveUsuario(): void {
    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.usuario.correo)) {
      this.openMensaje('Por favor ingresa un correo válido');
      return;
    }

    if (!this.usuario.correo.includes(' ')) {
      this.cargando = true;

      // Hash password if it was changed
      if (this.originalPassword !== this.usuario.contrasena) {
        const md5 = new Md5();
        const newPassword = this.usuario.contrasena;
        this.usuario.contrasena = md5.appendStr(newPassword).end().toString();
      }

      // Update username if email changed
      if (this.usuario.correo !== this.usuario.usuario) {
        this.usuario.usuario = this.usuario.correo;
      }

      this.dataServicio.editar(this.usuario).subscribe({
        next: data => {
          this.cargando = false;
          
          // Update session if user is logged in
          if (this.autenticador.getUsuario()) {
            sessionStorage.setItem('usuario', this.usuario.usuario);
          }

          this.openMensaje(
            `Cambiaste exitosamente tus datos ${this.usuario.usuario}`,
            'closeAll'
          );
        },
        error: error => {
          this.cargando = false;
          this.openMensaje(error.error?.message || 'Error al actualizar los datos');
        }
      });
    } else {
      this.openMensaje('El correo no permite espacios en blanco');
    }
  }

  validateEmail(): void {
    const emailField = document.getElementById('email') as HTMLInputElement;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailField) {
      if (emailPattern.test(this.usuario.correo)) {
        emailField.style.borderColor = '#666';
        emailField.style.background = 'linear-gradient(145deg, #2f2f2f, #1f1f1f)';
      } else {
        emailField.style.borderColor = '#ff6b6b';
        emailField.style.background = 'linear-gradient(145deg, #3a2222, #2a1a1a)';
      }
    }
  }

  closeDialog(): void {
    this.dialog.closeAll();
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