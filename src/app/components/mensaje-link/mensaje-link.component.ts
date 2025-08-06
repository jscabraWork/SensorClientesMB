import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-mensaje-link',
  standalone: true,
  imports: [],
  templateUrl: './mensaje-link.component.html',
  styleUrl: './mensaje-link.component.scss'
})
export class MensajeLinkComponent implements OnInit {

  mensaje
  id
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog:MatDialog ) { }

  ngOnInit(): void {
    this.mensaje = this.data.mensaje
    this.id = this.data.id
  }
}
