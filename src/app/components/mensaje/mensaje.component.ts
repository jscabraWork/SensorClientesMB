import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-mensaje',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './mensaje.component.html',
  styleUrl: './mensaje.component.scss'
})
export class MensajeComponent implements OnInit {

  mensaje: string;
  mostrarBotones: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MensajeComponent>
  ) { 
    this.dialogRef.addPanelClass('mensaje-dialog-transparent');
  }

  cerrar(result: boolean = false) {
    this.dialogRef.close(result);
  }

  confirmar() {
    this.dialogRef.close(true);
  }

  cancelar() {
    this.dialogRef.close(false);
  }

  ngOnInit(): void {
    this.mensaje = this.data.mensaje;
    this.mostrarBotones = this.data.mostrarBotones || false;
  }
}
