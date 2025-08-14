import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Evento } from '../../../../models/evento.model';
import { MensajeComponent } from '../../../mensaje/mensaje.component';
import { Alcancia } from '../../../../models/alcancia.model';
import { MisAlcanciasDto } from '../../../../models/misalcancias.model';
import { AlcanciasDataService } from '../../../../service/data/alcancias-data.service';
import { OrdenDataService } from '../../../../service/data/orden-data.service';
import { PtpDataService } from '../../../../service/data/ptp-data.service';
import { Cliente } from '../../cliente.model';
import { ClientesPagoDataService } from '../../../../service/data/clientes-pago-data.service';
import { Localidad } from '../../../../models/localidad.model';

@Component({
  selector: 'app-mis-alcancias',
  standalone: true,
  templateUrl: './mis-alcancias.component.html',
  styleUrls: ['./mis-alcancias.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule
  ]
})
export class MisAlcanciasComponent implements OnInit {
  cargando: boolean = false;
  misAlcancias: MisAlcanciasDto[] = [];
  valorTotal: number[] = [];
  description: string[] = [];
  pagar: boolean = false;
  codigoOrden: string = '';
  
  @Input()
  cliente: Cliente = new Cliente();

  constructor(
    private alcanciasService: AlcanciasDataService, 
    private dialog: MatDialog, 
    private ordenService: OrdenDataService, 
    private ptpService: PtpDataService, 
    private clienteService: ClientesPagoDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.pagar = false;
    this.valorTotal = [];
    this.misAlcancias = [];
    this.description = [];
    this.cargando = true;
    
    this.alcanciasService.getMisAlcanciasByCliente(this.cliente.numeroDocumento).subscribe({
      next: (misAlcancias: MisAlcanciasDto[]) => {
        this.cargando = false;
        this.misAlcancias = misAlcancias || [];
        if (this.misAlcancias.length > 0) {
          this.inicializarValores();
        }
      },
      error: error => {
        this.cargando = false;
        this.openMensaje('Ocurrió un error al cargar las alcancías');
      }
    });
  }

  inicializarValores(): void {
    for (let i = 0; i < this.misAlcancias.length; i++) {
      let valorFaltante = this.misAlcancias[i].precioTotal - this.misAlcancias[i].precioParcialPagado;
      this.valorTotal.push(valorFaltante);
      this.description.push('Aporte a alcancia para el evento ' + this.misAlcancias[i].eventoNombre);
    }
  }

  getValorFaltante(misAlcancia: MisAlcanciasDto): number {
    return misAlcancia.precioTotal - misAlcancia.precioParcialPagado;
  }

  pago(i: number, id: number): void {
    if (this.pagar === false) {
      const valorFaltante = this.misAlcancias[i].precioTotal - this.misAlcancias[i].precioParcialPagado;
      const aporteMinimo = this.misAlcancias[i].aporteMinimo || 30000;
      
      // Validar aporte mínimo, pero si el aporte mínimo es mayor al valor faltante, permitir pagar
      const montoMinimoValido = Math.min(aporteMinimo, valorFaltante);
      
      if (this.valorTotal[i] < montoMinimoValido) {
        const montoFormateado = montoMinimoValido.toLocaleString();
        this.openMensaje(`El mínimo valor a ingresar es $${montoFormateado}`);
      } else if (this.valorTotal[i] > valorFaltante) {
        const valorFormateado = valorFaltante.toLocaleString();
        this.openMensaje(`El valor máximo a ingresar es de $${valorFormateado}`);
      } else {
        this.pagar = true;
        this.ordenService.crearOrdenAporte(id, this.valorTotal[i])
          .subscribe({
            next: response => {
              this.codigoOrden = response.ordenId;
              // Redirigir a carrito-final con la nueva orden
              this.router.navigate(['/carrito-final', this.codigoOrden]).then(() => {
                window.scrollTo(0, 0);
              });
            },
            error: error => {
              this.pagar = false;
              this.openMensaje('Sucedió un error, por favor vuelva a intentar');
            }
          });
      }
    } else {
      this.openMensaje('Cargando');
    }
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
  }
}