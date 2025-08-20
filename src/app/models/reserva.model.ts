import { Ticket } from "./ticket.model";

export class Reserva{
    id:number;
    clienteId:string;
    promotorNumeroDocumento:string;
    activa: boolean;
    creationDate:Date;
    cantidad:number;
    tickets: Ticket[]
}
