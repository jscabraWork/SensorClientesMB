import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { Evento } from '../../../../models/evento.model';
import { Adicionales } from '../../../../models/adicionales.model';
import { ClientePagos } from '../../../../models/cliente-pagos.model';
import { Cupon } from '../../../../models/cupon.model';
import { Localidad } from '../../../../models/localidad.model';
import { Orden } from '../../../../models/orden.model';
import { Ticket } from '../../../../models/ticket.model';
import { EventoDataService } from '../../../../service/data/evento-data.service';
import { OrdenDataService } from '../../../../service/data/orden-data.service';
import { HardcodedAutheticationService } from '../../../../service/hardcoded-authetication.service';
import { AuthService } from '../../../../service/seguridad/auth.service';
import { MensajeComponent } from '../../../mensaje/mensaje.component';
import { ConfirmacionComponent } from '../confirmacion/confirmacion.component';

@Component({
  selector: 'app-compras-pendientes',
  standalone: true,
  templateUrl: './compras-pendientes.component.html',
  styleUrl: './compras-pendientes.component.scss',
  imports: [
    CommonModule,
    MatDialogModule,
    DatePipe,
    CurrencyPipe
  ]
})
export class ComprasPendientesComponent implements OnInit {
  cliente: ClientePagos = new ClientePagos();
  precioTotal: number[] = [];
  ordenes: Orden[] = [];
  eventos: Evento[] = [];
  localidades: Localidad[] = [];
  eventosConLocalidades: any[] = [];
  ticketsPorOrden: Ticket[][] = [];
  transaccionesPendientes: any[] = [];
  orden: Orden = new Orden();
  serviciosPorOrden: { [ordenId: number]: Adicionales[] } = {};
  cuponesPorOrden: { [ordenId: number]: Cupon } = {};

  correo: string = '';
  cargando: boolean = false;

  constructor(
    private dialog: MatDialog,
    private ordenService: OrdenDataService,
    private route: ActivatedRoute,
    private router: Router,
    private eventoService: EventoDataService,
    private authService: HardcodedAutheticationService
  ) {}

  ngOnInit(): void {
    this.correo = this.authService.getUsuario();
    this.ordenesEnProcesoPorCliente();
  }

  // Método para manejar el click en pagar
  confirmarPago(indiceOrden: number): void {
    const transaccionPendiente = this.transaccionesPendientes?.[indiceOrden];
    
    if (transaccionPendiente) {
      // Mostrar confirmación si hay transacción pendiente
      this.openMensajeConfirmacion(
        `Esta orden tiene un pago en proceso con ${transaccionPendiente.metodoNombre}, ¿deseas continuar?`,
        () => this.procederConPago(indiceOrden)
      );
    } else {
      // Proceder directamente con el pago
      this.procederConPago(indiceOrden);
    }
  }

  // Método para proceder con el pago
  procederConPago(indiceOrden: number): void {
    const ordenId = this.ordenes[indiceOrden].id;
    // Redirigir al carrito con el ID de la orden
    this.router.navigate(['/eventos/carrito', ordenId]);
  }

  // Método para mostrar mensaje con confirmación
  openMensajeConfirmacion(mensaje: string, onConfirm: () => void): void {
    let screenWidth = screen.width;
    let anchoDialog: string = '500px';
    let anchomax: string = '80vw';
    let altoDialog: string = '250';
    if (screenWidth <= 600) {
      anchoDialog = '100%';
      anchomax = '100%';
      altoDialog = 'auto';
    }
    
    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: anchoDialog,
      maxWidth: anchomax,
      height: altoDialog,
      data: {
        mensaje: mensaje
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        onConfirm();
      }
    });
  }

  ordenesEnProcesoPorCliente(): void {
    this.cargando = true;
    this.ordenService.getAllOrdenesEnProcesoByClienteId(this.correo).subscribe({
      next: response => {
        console.log(response);

        if (response == null || response.mensaje === 'No tienes ordenes pendientes') {
          this.cargando = false;
          this.openMensaje("No tienes compras pendientes,ve a la pagina principal");
        } else {
          this.ordenes = response.ordenes;
          this.ticketsPorOrden = response.ticketsPorOrden;
          this.eventos = response.info.eventos;
          this.localidades = response.info.localidades;
          this.serviciosPorOrden = response.servicioOrdenes;
          this.cuponesPorOrden = response.cupones;
          this.transaccionesPendientes = response.transaccionesPendientes;
          this.cargando = false;
        }
      },
      error: err => {
        this.cargando = false;
        this.openMensaje("Error,vuelve a la pagina principal");
      }
    });
  }

  darImagenTipo1(evento: Evento) {
    const primeraImagenTipo1 = evento.imagenes?.find(imagen => imagen.tipo === 1);
    var urlPrimeraImagenTipo1 = "";
    if (primeraImagenTipo1) {
      urlPrimeraImagenTipo1 = primeraImagenTipo1.url;
    }
    return urlPrimeraImagenTipo1;
  }

  // getTotalTickets(i: number): number {
  //   const cupon = this.getCuponDeOrden(this.ordenes[i].id);
  //   let total: number = 0;

  //   if (cupon != null) {
  //     total = this.ticketsPorOrden[i].reduce((total, ticket) => {
  //       let precioTicket: number = 0;
  //       if (ticket.precio != 0) {
  //         precioTicket = (+ticket.precio || 0) + (+ticket.servicio || 0) + (+ticket.servicio_iva || 0);
  //         ticket.precio = cupon.precio;
  //         ticket.servicio_iva = cupon.iva;
  //         ticket.servicio = cupon.servicio;
  //       }
  //       return total + precioTicket;
  //     }, 0);
  //   }
  //   else {
  //     total = this.ticketsPorOrden[i].reduce((total, ticket) => {
  //       const precioTicket = (+ticket.precio || 0) + (+ticket.servicio || 0) + (+ticket.servicio_iva || 0);
  //       return total + precioTicket;
  //     }, 0);
  //   }
  //   return total;
  // }

  getServiciosPorOrden(ordenId: number): Adicionales[] {
    if (this.serviciosPorOrden) {
      return this.serviciosPorOrden[ordenId] || [];
    }
    else {
      return [];
    }
  }

  getCuponDeOrden(ordenId: number): Cupon | null {
    if (!this.cuponesPorOrden) {
      return null;
    }
    const cupon = this.cuponesPorOrden[ordenId];
    return cupon || null;
  }

  getTotalServicios(ordenId: number): number {
    return this.getServiciosPorOrden(ordenId).reduce((total, servicio) => total + (+servicio.precio + servicio.servicio + servicio.servicioIva || 0), 0);
  }

  // getTotalGeneral(i: number, ordenId: number): number {
  //   let total: number = 0;
  //   total += this.getTotalTickets(i) + (this.getTotalServicios(ordenId) * this.ticketsPorOrden[i].length);
  //   if (this.ordenes[i].seguro && this.ordenes[i].seguro > 0) {
  //     total += this.ordenes[i].seguro;
  //   }
  //   return total;
  // }

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
  }
}