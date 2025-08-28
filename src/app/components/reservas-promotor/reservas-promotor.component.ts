import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Reserva } from '../../models/reserva.model';
import { Evento } from '../../models/evento.model';
import { Localidad } from '../../models/localidad.model';
import { HardcodedAutheticationService } from '../../service/hardcoded-authetication.service';
import { BaseComponent } from '../../common-ui/base.component';
import { ClientePagos } from '../../models/cliente-pagos.model';
import { ReservasDataService } from '../../service/data/reservas-data.service';
import { ClientesPagoDataService } from '../../service/data/clientes-pago-data.service';
import { PromotorDataService } from '../../service/data/promotor-data.service';
import { Promotor } from '../../models/promotor.model';
import { LoginComponent } from '../login/login.component';
import { MensajeComponent } from '../mensaje/mensaje.component';
import { OrdenDataService } from '../../service/data/orden-data.service';

@Component({
  selector: 'app-reservas-promotor',
  standalone: true,
  imports: [ CommonModule,
      FormsModule,
      RouterModule,
      MatDialogModule],
  templateUrl: './reservas-promotor.component.html',
  styleUrl: './reservas-promotor.component.scss'
})
export class ReservasPromotorComponent extends BaseComponent{

  reserva:Reserva = new Reserva();
  evento: Evento = new Evento();
  promotor: Promotor = new Promotor();
  localidad:Localidad
  documentoCliente: string | null = null;

  constructor(
    private authService: HardcodedAutheticationService,
    private reservaService: ReservasDataService,
    private ordenService: OrdenDataService,
    private router: Router,
    dialog: MatDialog,
    route: ActivatedRoute,
  ) {
    super(dialog, route);
    this.pathVariableName = 'id';
  }

  protected override cargarDatos(): void {
    // Verificar si el usuario está logueado
    if (!this.authService.usuarioLoggin()) {
      this.openLoginModal();
      return;
    }

    this.documentoCliente = this.authService.getCC();

    this.iniciarCarga();
    this.reservaService.getPorId(this.pathVariable).subscribe((response) => {
        this.reserva = response.reserva;
        this.evento = response.evento;
        this.localidad = response.localidad;
        this.promotor = response.reserva.promotor;
        this.finalizarCarga();
        
        if (this.reserva == null) {
          this.mostrarMensaje('Esta reserva no existe');
          this.cargando = false;
          return;
        }

        // Validar que la reserva pertenece al usuario logueado
        if (this.reserva.clienteId !== this.documentoCliente) {
          this.mostrarMensajeYRedirigir('Esta reserva no está a tu nombre');
          return;
        }

        // Validar que la reserva esté activa
        if (!this.reserva.activa) {
          this.mostrarMensajeYRedirigir('Esta reserva ya no se encuentra activa');
          return;
        }
      },
      error => {
        this.finalizarCarga();
        this.mostrarMensaje('Error al cargar la reserva');
      }
    );
  }

  openLoginModal(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '600px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (this.authService.usuarioLoggin()) {
        this.cargarDatos();
      } else {
        this.router.navigate(['/home']);
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



  confirmarProceso(): void {
    const mensaje = `¿Deseas continuar? A partir de aquí la reserva quedará inactiva y no podrás cancelar el proceso.`;
    this.mostrarConfirmacion(mensaje, () => {
      this.inactivarReservaYCrearOrden();
    });
  }

  private inactivarReservaYCrearOrden(): void {
    this.cargando = true;
    
    // Primero inactivar la reserva
    this.reserva.activa = false;
    this.reservaService.inactivarReserva(this.reserva.id).subscribe({
      next: () => {
        // Si la inactivación es exitosa, crear la orden
        this.crearOrden();
      },
      error: (error) => {
        console.error('Error al inactivar reserva:', error);
        this.cargando = false;
        this.mostrarMensaje('Error al procesar la reserva, por favor intenta nuevamente');
      }
    });
  }

  private crearOrden(): void {
    this.ordenService.crearOrdenNoNumeradaPromotor(
      this.reserva.cantidad,
      this.localidad.id,
      this.evento.id,
      this.documentoCliente,
      this.promotor.numeroDocumento
    ).subscribe({
      next: (response) => {
        this.cargando = false;
        if (response.ordenId) {
          this.router.navigate(['/carrito-final', response.ordenId]);
        } else if (response.mensaje) {
          this.mostrarMensaje(response.mensaje);
        }
      },
      error: (error) => {
        console.error('Error al crear orden:', error);
        this.cargando = false;
        this.mostrarMensaje('Error al crear la orden, por favor intenta nuevamente');
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





