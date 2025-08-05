import { Reserva } from "src/app/models/reserva.model";

export class Palco {

	id:number;
      precio:number;
	
	  precioParcialPagado:number
	
	  servicio:number;
	
	  nombreEvento:string;
	  nombre:string;
	  personasAdentro: number;
	  vendido:boolean;
	  reservado:boolean;
	  personasMaximas:number;
	  numeroDentroDeEvento:string;
	  fechaVendido : Date;
	  servicioIva:number;
	  proceso:boolean;
	  disponible:boolean;
	  idLocalidad:number;
	  reserva:Reserva;
	  precioAlterno:number;
	  servicioAlterno:number;	  
	  servicioIvaAlterno:number;
	  adiciones: number;
      maximoAdiciones: number;
      precioAdicion: number;
	  servicioAdicion: number;
	  servicioIvaAdicion:number;
	  metodo:string
}
