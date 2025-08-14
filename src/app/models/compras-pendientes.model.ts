import { Orden } from './orden.model';
import { Ticket } from './ticket.model';

export class ComprasPendientesDto {
  orden: Orden;
  eventoId: number;
  eventoNombre: string;
  precio: number;
  tickets: Ticket[];
  imagen: string;
  localidad: string;

  constructor() {
    this.orden = new Orden();
    this.eventoId = 0;
    this.eventoNombre = '';
    this.precio = 0;
    this.tickets = [];
    this.imagen = '';
    this.localidad = '';
  }
}