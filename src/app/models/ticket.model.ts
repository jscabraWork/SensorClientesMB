export class Ticket{

	id:number;
	//0 disponible, 1 vendida, 2 reservada, 3 en proceso, 4 no disponible
	 estado:number;
	numero_dentro_de_evento:string;
	personas_maximas:number;
    personas_adentro:number;
	fechaValidez:Date;
	precio:number;
	servicio:number;
	servicio_iva:number;
	tipo: number;
	maximoAdiciones:number;
	precioAdicion:number;
	servicioAdicion:number;
	servicioIvaAdicion:number;
	localidadId:number;
	precioOriginal:number;
	servicioOriginal:number;
	servicioIvaOriginal:number;
	adiciones:number;
	asientos:Ticket[]

	cantidadAsientos?: number;
	asientosDisponibles?: number;

}