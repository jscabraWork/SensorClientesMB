import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { CodigoValidacionDataService } from '../../service/data/codigo-validacion-data.service';

@Component({
  selector: 'app-confirmar-registro',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './confirmar-registro.component.html',
  styleUrl: './confirmar-registro.component.scss'
})
export class ConfirmarRegistroComponent implements OnInit {

  idCodigo: string
  message: string
  cargando: boolean

  constructor(
    private service: CodigoValidacionDataService, 
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cargando = true
    this.route.paramMap.subscribe(params => {
      this.idCodigo = params.get('idCodigo')
      this.service.crearUsuarioDesdeCodigo(this.idCodigo).subscribe({
        next: response => {
          this.message = response.mensaje
          this.cargando = false
        }, 
        error: error => {
          this.message = "Sucedio un error por favor vuelva a empezar el proceso de registro"
          this.cargando = false
        }
      })
    })
  }
}
