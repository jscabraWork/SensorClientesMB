import { Palco } from './palco.model';
import { Boleta } from '../eventos/boleta.model';
import { Evento } from '../eventos/evento.model';

export class PuntoFisico{
    nombre:string;
    numeroDocumento:string;
    tipoDocumento:string;
    usuario:string;
    contrasena:string;
    tipo:string;
    boletasVendidas: Boleta[];
    boletasCanjeadas:Boleta[];
    palcosVendidos:Palco[];
    palcosCanjeados:Palco[];
    eventos:Evento[];
}