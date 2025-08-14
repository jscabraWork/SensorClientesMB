import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MensajeComponent } from '../../../mensaje/mensaje.component';
import { Evento } from '../../../../models/evento.model';
import { Orden } from '../../../../models/orden.model';
import { firstValueFrom } from 'rxjs';

import { EventoDataService } from '../../../../service/data/evento-data.service';
import { OrdenDataService } from '../../../../service/data/orden-data.service';
import { AuthService } from '../../../../service/seguridad/auth.service';

@Component({
  selector: 'app-respuesta',
  templateUrl: './respuesta.component.html',
  styleUrls: ['./respuesta.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule
  ]
})
export class RespuestaComponent implements OnInit, OnDestroy {
  refPayco: string = ''
  transactionResponse: any;
  pixel: boolean = false
  pixel2: boolean = false
  pixel3: boolean = false
  orden: Orden
  transacciones:any []
  eventoId: number
  ordenId
  banco:string
  valor:number
  cargando:boolean
  evento: Evento
  
  // Variables para auto-refresh
  private autoRefreshInterval: any;
  private countdownInterval: any;
  private isAutoRefreshActive: boolean = false;
  countdown: number = 15;

  constructor(
    private ordenService: OrdenDataService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private eventoService: EventoDataService,
    private router: Router,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    // Esperar a que se complete la carga de la sesión
    this.authService.cargarSesionDesdeLocalStorage();

    // Solo continuar si la sesión se cargó correctamente o si ya estamos autenticados
      this.activatedRoute.paramMap.subscribe(async params => {
        this.ordenId = params.get('idOrden');
        
        // Validar orden antes de ejecutar cualquier otra operación
        //await this.validarOrden();
        await this.refrescar();
        this.cargarEvento();

      });

  }

  // Método para validar la orden antes de cualquier operación
  async validarOrden(){
    try {
      await this.ordenService.validarOrdenPtp(this.ordenId).toPromise();
    } catch (error) {
      this.mensaje('No se pudo obtener la respuesta de la orden. Por favor, inténtelo más tarde.');
    }
  }

  async refrescar() {
    try {
      const response = await firstValueFrom(this.ordenService.getRespuestaOrden(this.ordenId));

      console.log(response)
      this.orden = response.orden;
      this.transacciones = response.transacciones;
      this.eventoId = response.orden.eventoId

      if (this.transacciones.length > 0) {
        this.banco = this.transacciones[this.transacciones.length-1].metodoNombre;
        this.valor = this.transacciones[this.transacciones.length-1].amount;
      }
      
      // Solo iniciar auto-refresh si está en proceso y no está ya activo
      if (this.orden?.estado === 3 && !this.isAutoRefreshActive) {
        this.startAutoRefresh();
      } else if (this.orden?.estado !== 3 && this.isAutoRefreshActive) {
        // Si ya no está en proceso, detener el auto-refresh
        this.clearAutoRefresh();
      }
    } catch (error) {
      this.orden = new Orden();
      console.error('Error al obtener la orden:', error);
    }
  }

  cargarEvento() {
    // Obtener el perfil del evento
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

  // Métodos para el manejo de estados y iconos
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

  // Auto-refresh para transacciones en proceso
  private startAutoRefresh(): void {
    // Si ya hay un auto-refresh activo, limpiar primero para evitar duplicación
    if (this.isAutoRefreshActive) {
      this.clearAutoRefresh();
    }
    
    if (this.orden?.estado === 3) {
      this.isAutoRefreshActive = true;
      this.resetCountdown();
      
      // Countdown timer separado
      this.countdownInterval = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          this.resetCountdown(); // Resetear cuando llegue a 0
        }
      }, 1000);

      // Auto-refresh cada 15 segundos
      this.autoRefreshInterval = setInterval(async () => {
        this.resetCountdown(); // Resetear el contador antes de refrescar
        await this.refrescar();
      }, 15000);
    }
  }
  
  // Método separado para resetear el countdown
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

  // Refresh manual - disponible siempre
  async refrescarManual(): Promise<void> {
    // Reiniciar el contador antes de refrescar
    if (this.isAutoRefreshActive && this.orden?.estado === 3) {
      this.resetCountdown();
    }
    await this.refrescar();
  }

  // Métodos de navegación
  volverAlInicio(): void {
    this.router.navigate(['/']);
  }
  
  intentarNuevamente(): void {
    this.router.navigate(['/eventos/evento', this.eventoId]);
  }

  mensaje(mensaje, salir?): void {
    const dialogRef = this.dialog.open(MensajeComponent, {
      width: '600px',
      maxHeight:'250px' ,
      data: {
        mensaje: mensaje,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (salir) {
        this.router.navigate(['/home'])
      }
    });
  }

}
