import { Palco } from './palco.model';
import { Boleta } from '../eventos/boleta.model';
import { Evento } from '../eventos/evento.model';

export class Promotor {
    nombre:string;
    numeroDocumento:string;
    tipoDocumento:string;
    usuario:string;
    contrasena:string;
    tipo:string;
    codigoventa:string;
	dineroTotal:string;

    correo:string;
    celular:string;
    precioPromotorActivo:boolean;
    idPromotor: string;
	
}