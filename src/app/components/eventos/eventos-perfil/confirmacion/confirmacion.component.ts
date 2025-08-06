import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmacion',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule
  ],
  templateUrl: './confirmacion.component.html',
  styleUrl: './confirmacion.component.scss'
})
export class ConfirmacionComponent implements OnInit {

  refPayco: string = ''
	transactionResponse:any ;
  mensaje: string;
  constructor(
    @Inject(MAT_DIALOG_DATA ) public data: any,
    private dialog: MatDialogRef<ConfirmacionComponent>
  ) {
   }

  ngOnInit(): void {
    this.mensaje = this.data.mensaje;
  }

  confirmar(confirmacion:boolean){
      this.dialog.close(confirmacion)
  }

}
