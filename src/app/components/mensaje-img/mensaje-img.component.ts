import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mensaje-img',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mensaje-img.component.html',
  styleUrl: './mensaje-img.component.scss'
})
export class MensajeImgComponent implements OnInit {
  img: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MensajeImgComponent>
  ) { }

  ngOnInit(): void {
    if (this.data.img) {
      this.img = this.data.img;
    }
  }
}