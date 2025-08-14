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
import { ComprasPendientesDto } from '../../../../models/compras-pendientes.model';
import { EventoDataService } from '../../../../service/data/evento-data.service';
import { OrdenDataService } from '../../../../service/data/orden-data.service';
import { HardcodedAutheticationService } from '../../../../service/hardcoded-authetication.service';
import { AuthService } from '../../../../service/seguridad/auth.service';
import { MensajeComponent } from '../../../mensaje/mensaje.component';
import { ConfirmacionComponent } from '../confirmacion/confirmacion.component';
import { TransaccionDataService } from '../../../../service/data/transaccion-data.service';

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
  comprasPendientes: ComprasPendientesDto[] = [];
  cargando: boolean = false;

  constructor(
    private dialog: MatDialog,
    private ordenService: OrdenDataService,
    private router: Router,
    private authService: HardcodedAutheticationService,
    private transaccionService: TransaccionDataService,
  ) {}

  ngOnInit(): void {
    const numeroDocumento = this.authService.getCC();
    if (numeroDocumento) {
      this.cargarComprasPendientes(numeroDocumento);
    }
  }

  cargarComprasPendientes(numeroDocumento: string): void {
    this.cargando = true;
    this.ordenService.getComprasPendientesByCliente(numeroDocumento).subscribe({
      next: (compras: ComprasPendientesDto[]) => {
        this.comprasPendientes = compras || [];
        this.cargando = false;
      },
      error: (error) => {
        this.cargando = false;
        this.openMensaje('Error al cargar las compras pendientes');
      }
    });
  }

  // Método para proceder con el pago
  procederConPago(compra: ComprasPendientesDto): void {
    this.transaccionService.verificarTransaccionEnProceso(compra.orden.id).subscribe({
      next: (response: any) => {
        if (response.mensaje.includes('tiene una transacción en proceso')) {
          // Mostrar mensaje y luego redirigir
          this.openMensaje(response.mensaje, () => {
            this.router.navigate(['/carrito-final', compra.orden.id]);
          });
        } else {
          // Redirigir directamente
          this.router.navigate(['/carrito-final', compra.orden.id]);
        }
      },
      error: (error) => {
        this.openMensaje('Error al verificar el estado de la transacción');
      }
    });
  }


  openMensaje(mensajeT: string, callback?: () => void): void {
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

    if (callback) {
      dialogRef.afterClosed().subscribe(() => {
        callback();
      });
    }
  }
}