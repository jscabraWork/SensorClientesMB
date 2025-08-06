import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-error',
  standalone: true,
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class ErrorComponent implements OnInit {
  mensajeError = "Sucedió un error, por favor vuelve a la página principal";
  
  constructor(private location: Location) { }

  ngOnInit(): void {
  }

  goBack(): void {
    this.location.back();
  }
}