import { Component, HostListener, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HardcodedAutheticationService } from '../../service/hardcoded-authetication.service';
import { MatDialog } from '@angular/material/dialog';
import { Cliente } from '../usuario/cliente.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  cliente: Cliente;
  usuario:string;
  nombreBuscador:string
  cc:string
  nombre:string
  visibleMenuResponsive:boolean = false;
  cargando = false;
  isMobileView: boolean = window.innerWidth < 920;

  @Output() valorCambiado = new EventEmitter<boolean>();

    constructor(private router: Router,public autenticacion: HardcodedAutheticationService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.visibleMenuResponsive=false

    this.cargarUsuario()
  }



  abrirCampoBuscador(){
    this.router.navigate(['/eventos/buscador/',this.nombreBuscador])

  }
  cargarUsuario(){
    this.usuario=this.autenticacion.getUsuario();
  }


  openDialog(): void {
    this.router.navigate(['/registrarse'])
  }

  openDialog2(): void {
    this.router.navigate(['/login'])
  }

  cambiarVisibilidadMenuResponsive(){
    if (window.innerWidth <= 920) {
      this.visibleMenuResponsive = !this.visibleMenuResponsive;
      this.valorCambiado.emit(this.visibleMenuResponsive);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if(window.innerWidth < 920){
      this.visibleMenuResponsive=false
      this.valorCambiado .emit(false);
    }
    else{
      this.visibleMenuResponsive=false
      this.valorCambiado .emit(false);
    }
  }
}