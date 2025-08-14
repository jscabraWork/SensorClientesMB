import { Alcancia } from './alcancia.model';
import { Ticket } from './ticket.model';

export class MisAlcanciasDto {
  alcancia: Alcancia;
  precioParcialPagado: number;
  precioTotal: number;
  tickets: Ticket[];
  eventoId: number;
  eventoNombre: string;
  imagen: string;
  localidad: string;
  aporteMinimo: number;

  constructor() {
    this.alcancia = new Alcancia();
    this.precioParcialPagado = 0;
    this.precioTotal = 0;
    this.tickets = [];
    this.eventoId = 0;
    this.eventoNombre = '';
    this.imagen = '';
    this.localidad = '';
    this.aporteMinimo = 0;
  }
}