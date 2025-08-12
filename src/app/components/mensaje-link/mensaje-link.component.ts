import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mensaje-link',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './mensaje-link.component.html',
  styleUrl: './mensaje-link.component.scss'
})
export class MensajeLinkComponent implements OnInit {

  mensaje: string = '';
  id: string = '';
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.mensaje = this.data.mensaje;
    this.id = this.data.id;
  }
}
