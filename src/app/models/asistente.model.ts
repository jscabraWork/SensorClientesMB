import { Boleta } from 'src/app/eventos/boleta.model';

export interface Asistente{
     numeroDocumento:number;
	 celular:string;
	 correo:string;
     boletas: Boleta[];
     nombre:string; 

}