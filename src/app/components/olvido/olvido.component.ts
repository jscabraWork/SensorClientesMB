import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { UsuariosDataService } from '../../service/data/usuarios-data.service';

@Component({
  selector: 'app-olvido',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './olvido.component.html',
  styleUrl: './olvido.component.scss'
})
export class OlvidoComponent implements OnInit {
  errorMessage: string
  correo: string
  processing: boolean = false
  
  constructor(private servicio: UsuariosDataService) {}

  ngOnInit(): void {
    this.correo = ""
  }

  validateEmail() {
    const emailField = document.getElementById('email') as HTMLInputElement;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(this.correo)) {
      emailField.style.borderColor = '#666';
      emailField.style.background = 'linear-gradient(145deg, #2f2f2f, #1f1f1f)';
    } else {
      emailField.style.borderColor = '#ff6b6b';
      emailField.style.background = 'linear-gradient(145deg, #3a2222, #2a1a1a)';
    }
  }

  enviar() {
    if (!this.correo || !this.correo.trim()) {
      this.errorMessage = "Por favor ingresa un correo electrónico";
      return;
    }
    
    this.processing = true;
    this.errorMessage = null;
    
    this.servicio.olvidoContrasenia(this.correo).subscribe({
      next: (response) => {
        this.processing = false;
        this.errorMessage = "Correo exitosamente enviado en caso de estar registrado";
      },
      error: (error) => {
        this.processing = false;
        this.errorMessage = "Ocurrió un error al procesar tu solicitud. Intenta nuevamente.";
      }
    });
  }
}
