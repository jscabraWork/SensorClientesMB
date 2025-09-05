import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BaseComponent } from '../../common-ui/base.component';
import { TraspasoDataService } from '../../service/data/traspaso-data.service';
import { HardcodedAutheticationService } from '../../service/hardcoded-authetication.service';
import { Ticket } from '../../models/ticket.model';
import { Evento } from '../../models/evento.model';
import { Localidad } from '../../models/localidad.model';
import { LoginComponent } from '../login/login.component';
import { MensajeComponent } from '../mensaje/mensaje.component';

@Component({
  selector: 'app-confirmar-traspaso',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule],
  templateUrl: './confirmar-traspaso.component.html',
  styleUrl: './confirmar-traspaso.component.scss'
})
export class ConfirmarTraspasoComponent extends BaseComponent {
  ticket: Ticket = new Ticket();
  evento: Evento = new Evento();
  localidad: Localidad = new Localidad();
  codigoTraspaso: any = null;
  documentoCliente: string | null = null;
  mensajeError: string | null = null;

  constructor(
    private authService: HardcodedAutheticationService,
    private traspasoService: TraspasoDataService,
    private router: Router,
    dialog: MatDialog,
    route: ActivatedRoute,
  ) {
    super(dialog, route);
    this.pathVariableName = 'idCodigo';
  }

  protected override cargarDatos(): void {
    if (!this.pathVariable) {
      this.mostrarMensajeYRedirigir('Código de traspaso no proporcionado');
      return;
    }

    this.iniciarCarga();
    this.traspasoService.getCodigoParaConfirmacion(this.pathVariable).subscribe({
      next: (response) => {
        this.finalizarCarga();
        
        if (response.mensaje && response.mensaje.includes('no existe')) {
          this.mensajeError = response.mensaje;
          return;
        }
        
        if (response.mensaje && response.mensaje.includes('utilizado')) {
          this.mensajeError = response.mensaje;
          return;
        }

        // Datos válidos
        this.ticket = response.ticket;
        this.evento = response.evento;
        this.localidad = response.localidad;
        this.codigoTraspaso = response.codigo;
      },
      error: (error) => {
        this.finalizarCarga();
        this.mensajeError = error?.error?.mensaje || 'Error al validar el código de traspaso';
      }
    });
  }

  openLoginModal(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '600px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (this.authService.usuarioLoggin()) {
        this.documentoCliente = this.authService.getCC();
        // Después del login, proceder con la confirmación
        this.confirmarReclamoTicket();
      }
    });
  }

  mostrarMensajeYRedirigir(mensaje: string): void {
    let screenWidth = screen.width;
    let anchoDialog: string = 'auto';
    let anchomax: string = 'auto';
    let altoDialog: string = 'auto';
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
        mensaje: mensaje
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/home']);
    });
  }

  mostrarConfirmacion(mensaje: string, callback: () => void): void {
    let screenWidth = screen.width;
    let anchoDialog: string = 'auto';
    let anchomax: string = 'auto';
    let altoDialog: string = 'auto';
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
        mensaje: mensaje,
        mostrarBotones: true
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        callback();
      }
    });
  }

  confirmarReclamoTicket(): void {
    if (!this.authService.usuarioLoggin()) {

      this.mostrarMensaje("Debes estar registrado para poder realizar tu compra").subscribe(() => {

      this.openLoginModal();
      });
      return;
    }

    this.documentoCliente = this.authService.getCC();
    const mensaje = `¿Deseas confirmar el traspaso de este ticket? Una vez confirmado, el ticket será transferido a tu cuenta.`;
    this.mostrarConfirmacion(mensaje, () => {
      this.procesarConfirmacion();
    });
  }

  private procesarConfirmacion(): void {
    this.iniciarCarga();
    
    this.traspasoService.confirmarTransferenciaTicket(this.pathVariable!).subscribe({
      next: (response) => {
        this.finalizarCarga();
        const mensaje = response.mensaje || 'Ticket transferido exitosamente a tu cuenta';
        this.mostrarMensajeYRedirigir(mensaje);
      },
      error: (error) => {
        this.finalizarCarga();
        const mensajeError = error?.error?.mensaje || 'Error al confirmar el traspaso del ticket';
        this.mostrarError(mensajeError);
      }
    });
  }

  getImagenBanner(evento: Evento): string | null {
    if (!evento.imagenes || evento.imagenes.length === 0) {
      return null;
    }

    const imagenBanner = evento.imagenes.find(imagen => imagen.tipo === 2);
    return imagenBanner?.url || null;
  }
}