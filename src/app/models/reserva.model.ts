import { Ticket } from "./ticket.model";

export class Reserva{
    id:number;
    documentoReserva:string;
    numeroDocumento:string;
    activa: boolean;
    creationDate:Date;
    cantidad:number;
    tickets: Ticket[]
}