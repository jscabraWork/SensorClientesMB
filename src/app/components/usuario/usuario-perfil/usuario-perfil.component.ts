import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { Cliente } from '../cliente.model';
import { UsuariosDataService } from '../../../service/data/usuarios-data.service';
import { HardcodedAutheticationService } from '../../../service/hardcoded-authetication.service';
import { MensajeComponent } from '../../mensaje/mensaje.component';
import { MisTicketsComponent } from './mis-tickets/mis-tickets.component';
import { MisAlcanciasComponent } from './mis-alcancias/mis-alcancias.component';
import { respuesta } from '../../../app.constants';

@Component({
  selector: 'app-usuario-perfil',
  standalone: true,
  templateUrl: './usuario-perfil.component.html',
  styleUrls: ['./usuario-perfil.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatDialogModule,
    MatIconModule,
    MisTicketsComponent,
    MisAlcanciasComponent
  ]
})
export class UsuarioPerfilComponent implements OnInit {
  cargando: boolean = false;
  user: string = '';
  usuario: Cliente = new Cliente();
  tickets: boolean = false;
  datos: boolean = true;
  alcancias: boolean = false;
  respuesta: any;
  pagar: boolean = false;
  url: string = '';

  constructor(
    private autenticador: HardcodedAutheticationService,
    private dataServicio: UsuariosDataService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.pagar = false;
    this.respuesta = respuesta;
    this.usuario = new Cliente();
    this.cargando = true;

    if (this.autenticador.getUsuario()) {
      this.user = this.autenticador.getUsuario();
    }

    this.dataServicio.getCliente(this.user).subscribe({
      next: response => {
        this.usuario = response.usuario;
        this.cargando = false;
      },
      error: error => {
        this.cargando = false;
        this.openMensaje('Sucedió un error, vuelva a cargar');
      }
    });
  }

  openMensaje(mensajeT: string, openD?: string): void {
    let screenWidth = screen.width;
    let anchoDialog: string = '500px';
    let anchomax: string = '80vw';
    let altoDialog: string = '250';

    if (screenWidth <= 600) {
      anchoDialog = '100%';
      anchomax = '100%';
      altoDialog = 'auto';
    }

    const dialogRef = this.dialog.open(MensajeComponent, {
      width: anchoDialog,
      maxWidth: anchomax,
      height: altoDialog,
      data: {
        mensaje: mensajeT,
      },
    });

    if (openD === 'openD') {
      dialogRef.afterClosed().subscribe(() => {
        this.openDialog();
      });
    } else if (openD === 'onInit') {
      this.ngOnInit();
    }
  }

  openDialog(): void {
    // Dynamic import for the dialog component
    import('./cambiar-perfil/cambiar-perfil.component').then(({ CambiarPerfilComponent }) => {
      const dialogRef = this.dialog.open(CambiarPerfilComponent, {
        width: '600px',
        height: '500px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        data: {
          usuario: this.usuario,
        },
      });

      dialogRef.afterClosed().subscribe(() => {
        this.dialog.closeAll();
        this.ngOnInit();
      });
    });
  }

  // Tab navigation methods
  showDatos(): void {
    this.datos = true;
    this.tickets = false;
    this.alcancias = false;
  }

  showTickets(): void {
    this.datos = false;
    this.tickets = true;
    this.alcancias = false;
  }

  showAlcancias(): void {
    this.datos = false;
    this.tickets = false;
    this.alcancias = true;
  }
}