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
  usuario: ClientePagos = new ClientePagos();
  promotor: Promotor = new Promotor();
  localidad:Localidad
  idPromotor: string
  idLocalidad: number
  constructor(
    private authService: HardcodedAutheticationService,
    private reservaService: ReservasDataService,
    private clienteService: ClientesPagoDataService,
    private promotorService: PromotorDataService,
    private ordenService: OrdenDataService,
    private router: Router,
    dialog: MatDialog,
    route: ActivatedRoute,
  ) {
    super(dialog, route);
    this.pathVariableName = 'id';
  }

  protected override cargarDatos(): void {
    this.cargando = true;
    this.reservaService.getPorId(this.pathVariable).subscribe((response) => {
        this.reserva = response.reserva
        this.evento = response.evento
        this.localidad = response.localidad
        this.idPromotor = response.reserva.promotor.numeroDocumento
        if (this.reserva == null) {
          //alert("Esta reserva no existe")
          this.mostrarMensaje('Esta reserva no existe');
          this.cargando = false;

        }

        if(this.reserva.activa){

          const correo = this.authService.getUsuario();

          if (correo) {
            this.clienteService.getCliente(correo).subscribe((response) => {
              console.log(response)
              this.usuario = response.usuario
              if (this.reserva.clienteId == this.usuario.numeroDocumento) {
                this.promotorService.getPorId(this.idPromotor).subscribe(
                  (response) => {
                    this.promotor = response.promotor;
                    this.cargando = false;
                  },
                  (error) => {
                    this.mostrarMensaje('Error al obtener el promotor');
                    this.cargando = false;
                  }
                );
                this.cargando=false

              }
              else {
                //alert("Esta reserva no esta a tu nombre")
                this.mostrarMensaje('Esta reserva no esta a tu nombre');
                this.cargando = false;
              }
            })
          }
          else {
            this.openMensaje('Debes ingresar a tu cuenta AllTickets para realizar la compra, en caso de no tener, regístrate', 'openD');
            this.cargando = false;
    }
        }
      }
    )
  }

  openDialog2(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.cargarDatos();
    });
  }

  openMensaje(mensajeT: string, openD?: string): void {
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
        mensaje: mensajeT
      }
    });
    if (openD == 'openD') {
      dialogRef.afterClosed().subscribe((result) => {
        this.openDialog2();
      });
    } else if (openD == 'onInit') {
      this.ngOnInit();
    }
  }



  abrirCarrito(){
      this.cargando = true;
      this.idLocalidad = this.localidad.id;
      console.log(this.reserva.cantidad,this.idLocalidad, this.evento.id, this.usuario.numeroDocumento, this.idPromotor);
      this.ordenService.crearOrdenNoNumeradaConPromotor(
        this.reserva.cantidad,
        this.idLocalidad,
        this.evento.id,
        this.usuario.numeroDocumento,
        this.idPromotor
      ).subscribe({next: (response) => {
          console.log(response);
          if(response.ordenId){
            this.router.navigate(['/carrito-final', response.ordenId]);
            console.log("la ruta es: ", this.router.url);
          } else if(response.mensaje){
            this.openMensaje(response.mensaje);
          }

        }, error: (error) => {
          console.error(error);
          this.cargando = false;
          this.openMensaje('Error al crear la orden, por favor intenta nuevamente');
        }
      });
  }

}





