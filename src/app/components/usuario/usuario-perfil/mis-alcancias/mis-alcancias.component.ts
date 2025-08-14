import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Evento } from '../../../../models/evento.model';
import { MensajeComponent } from '../../../mensaje/mensaje.component';
import { Alcancia } from '../../../../models/alcancia.model';
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
  alcancias: Alcancia[] = [];
  valorTotal: number[] = [];
  description: string[] = [];
  eventos: Evento[] = [];
  localidades: Localidad[] = [];
  cantidadTickets: number[] = [];
  pagar: boolean = false;
  codigoOrden: string = '';
  
  @Input()
  cliente: Cliente = new Cliente();

  constructor(
    private alcanciasService: AlcanciasDataService, 
    private dialog: MatDialog, 
    private ordenService: OrdenDataService, 
    private ptpService: PtpDataService, 
    private clienteService: ClientesPagoDataService
  ) {}

  ngOnInit(): void {
    this.pagar = false;
    this.valorTotal = [];
    this.alcancias = [];
    this.description = [];
    this.cantidadTickets = [];
    this.cargando = true;
    
    this.alcanciasService.listarPorAtributo(this.cliente.numeroDocumento).subscribe({
      next: response => {
        this.cargando = false;

        if (!response.mensaje) {
          this.manejoDeRespuesta(response);
        }
      },
      error: error => {
        this.cargando = false;
        this.openMensaje('Ocurrió un error al cargar las alcancías');
      }
    });
  }

  manejoDeRespuesta(response: any): void {
    this.alcancias = response.alcancias;
    this.eventos = response.infoEvento.body.eventos;
    this.localidades = response.infoEvento.body.localidades;
    this.cantidadTickets = response.cantidadTickets;

    for (let i = 0; i < this.alcancias.length; i++) {
      let valorActual = this.alcancias[i].precioTotal - this.alcancias[i].precioParcialPagado;
      this.valorTotal.push(valorActual);
      this.description.push('Aporte a alcancia para el evento ' + this.eventos[i].nombre);
    }
  }

  // pago(i: number, id: number): void {
  //   if (this.pagar === false) {
  //     const valorFaltante = this.alcancias[i].precioTotal - this.alcancias[i].precioParcialPagado;
      
  //     if (this.valorTotal[i] < 30000 && valorFaltante > 30000) {
  //       this.openMensaje('El mínimo valor a ingresar es $30.000');
  //     } else if (valorFaltante >= this.valorTotal[i]) {
  //       this.pagar = true;
  //       this.ordenService.crearOrdenAlcanciaCompra(this.eventos[i].id, id, this.cliente)
  //         .subscribe({
  //           next: response => {
  //             this.codigoOrden = response.idOrden;
  //             this.ptpService.getPeticionPTP(
  //               this.codigoOrden,
  //               this.valorTotal[i],
  //               this.description[i],
  //               0,
  //               0
  //             ).subscribe({
  //               next: response => {
  //                 window.location.href = response.processUrl;
  //               },
  //               error: error => {
  //                 this.pagar = false;
  //                 this.openMensaje('Sucedió un error, por favor vuelva a intentar');
  //               }
  //             });
  //           },
  //           error: error => {
  //             this.pagar = false;
  //             this.openMensaje('Sucedió un error, por favor vuelva a intentar');
  //           }
  //         });
  //     } else if (valorFaltante <= this.valorTotal[i]) {
  //       const valorFormateado = valorFaltante.toLocaleString();
  //       this.openMensaje(`El valor máximo a ingresar es de $${valorFormateado}`);
  //     }
  //   } else {
  //     this.openMensaje('Cargando');
  //   }
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