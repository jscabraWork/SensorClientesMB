import { Evento } from './../evento.model';
import { Localidad } from '../../../models/localidad.model';
export interface Etapa {

   
    id:number,
    localidades:Localidad[],
	nombre:string
	evento: Evento;
	visible:boolean;
	promotorVenta:boolean

}