import { Component, HostListener, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HardcodedAutheticationService } from '../../service/hardcoded-authetication.service';
import { MatDialog } from '@angular/material/dialog';
import { Cliente } from '../usuario/cliente.model';
import { LoginComponent } from '../login/login.component';
import { RegistrarseComponent } from '../registrarse/registrarse.component';

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


  cargarUsuario(){
    this.usuario=this.autenticacion.getUsuario();
  }


  abrirRegistro(): void {
    const dialogRef = this.dialog.open(RegistrarseComponent, {
      width: '700px',
      maxWidth: '90vw',
      disableClose: false,
    });
  }

  abrirIniciarSesion(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: false,
    });
  }

  cambiarVisibilidadMenuResponsive(){
    this.visibleMenuResponsive = !this.visibleMenuResponsive;
    this.valorCambiado.emit(this.visibleMenuResponsive);
  }

  cerrarMenuResponsive(){
    this.visibleMenuResponsive = false;
    this.valorCambiado.emit(this.visibleMenuResponsive);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobileView = window.innerWidth < 920;
    if(window.innerWidth >= 920){
      this.visibleMenuResponsive = false;
      this.valorCambiado.emit(false);
    }
  }

}