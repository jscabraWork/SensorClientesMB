import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MensajeComponent } from '../../../mensaje/mensaje.component';
import { Evento } from '../../evento.model';
import { Foto } from '../../../../models/foto.model';
import { Orden } from '../../../../models/orden.model';
import { firstValueFrom } from 'rxjs';

import { EventoDataService } from '../../../../service/data/evento-data.service';
import { OrdenDataService } from '../../../../service/data/orden-data.service';
import { HardcodedAutheticationService } from '../../../../service/hardcoded-authetication.service';
import { AuthService } from '../../../../service/seguridad/auth.service';

@Component({
  selector: 'app-respuesta',
  templateUrl: './respuesta.component.html',
  styleUrls: ['./respuesta.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MensajeComponent
  ]
})
export class RespuestaComponent implements OnInit, OnDestroy {
  refPayco: string = '';
  transactionResponse: any;
  url: Foto;
  pixel: boolean = false;
  pixel2: boolean = false;
  pixel3: boolean = false;
  orden: Orden;
  transacciones: any[] = [];
  eventoId: number;
  ordenId;
  banco: string;
  valor: number;
  evento: Evento;

  // Variables para auto-refresh
  private autoRefreshInterval: any;
  private countdownInterval: any;
  private isAutoRefreshActive: boolean = false;
  countdown: number = 15;

  constructor(
    private ordenService: OrdenDataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private eventoService: EventoDataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.cargarSesionDesdeLocalStorage();

    this.activatedRoute.paramMap.subscribe(async params => {
      this.ordenId = params.get('idOrden');
      await this.validarOrden();
      await this.refrescar();
      this.cargarEvento();
    });
  }

  async validarOrden() {
    try {
      await this.ordenService.validarOrdenPtp(this.ordenId).toPromise();
    } catch (error) {
      this.mensaje('No se pudo obtener la respuesta de la orden. Por favor, inténtelo más tarde.');
    }
  }

  async refrescar() {
    try {
      const response = await firstValueFrom(this.ordenService.getRespuestaOrden(this.ordenId));
      this.orden = response.orden;
      this.transacciones = response.transacciones;
      this.eventoId = response.orden.eventoId;

      if (this.transacciones.length > 0) {
        this.banco = this.transacciones[this.transacciones.length - 1].metodoNombre;
        this.valor = this.transacciones[this.transacciones.length - 1].amount;
      }

      if (this.orden?.estado === 3 && !this.isAutoRefreshActive) {
        this.startAutoRefresh();
      } else if (this.orden?.estado !== 3 && this.isAutoRefreshActive) {
        this.clearAutoRefresh();
      }
    } catch (error) {
      this.orden = new Orden();
      console.error('Error al obtener la orden:', error);
    }
  }

  cargarEvento() {
    this.eventoService.getById(this.eventoId).subscribe({
      next: evento => {
        this.evento = evento;
      },
      error: error => {
        console.error('Error al obtener el perfil del evento:', error);
      }
    });
  }

  ngOnDestroy(): void {
    this.clearAutoRefresh();
  }

  getTextoEstado(): string {
    switch (this.orden?.estado) {
      case 1:
        return 'APROBADA';
      case 2:
        return 'RECHAZADA';
      case 3:
        return 'EN PROCESO';
      default:
        return 'DESCONOCIDO';
    }
  }

  getIconoEstado(): string {
    switch (this.orden?.estado) {
      case 1:
        return 'assets/images/Vectores/success.svg';
      case 2:
        return 'assets/images/Vectores/rejected.svg';
      case 3:
        return 'assets/images/Vectores/refresh.svg';
      default:
        return 'assets/images/Vectores/refresh.svg';
    }
  }

  private startAutoRefresh(): void {
    if (this.isAutoRefreshActive) {
      this.clearAutoRefresh();
    }

    if (this.orden?.estado === 3) {
      this.isAutoRefreshActive = true;
      this.resetCountdown();

      this.countdownInterval = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          this.resetCountdown();
        }
      }, 1000);

      this.autoRefreshInterval = setInterval(async () => {
        this.resetCountdown();
        await this.refrescar();
      }, 15000);
    }
  }

  private resetCountdown(): void {
    this.countdown = 15;
  }

  private clearAutoRefresh(): void {
    this.isAutoRefreshActive = false;
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
      this.autoRefreshInterval = null;
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  async refrescarManual(): Promise<void> {
    if (this.isAutoRefreshActive && this.orden?.estado === 3) {
      this.resetCountdown();
    }
    await this.refrescar();
  }

  volverAlInicio(): void {
    this.router.navigate(['/']);
  }

  intentarNuevamente(): void {
    this.router.navigate(['/eventos/evento', this.eventoId]);
  }

  mensaje(mensaje: string, salir?: boolean): void {
    const dialogRef = this.dialog.open(MensajeComponent, {
      width: '600px',
      maxHeight: '250px',
      data: {
        mensaje: mensaje,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (salir) {
        this.router.navigate(['/home']);
      }
    });
  }
}
