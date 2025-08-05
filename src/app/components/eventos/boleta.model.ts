export interface Boleta {
    id: number,
   
    seccionSilla:string,
	imagenQr:string,
	precio:number,


	vendida:boolean,
	reservado:boolean,
	disponible:boolean,
	
	reserva:boolean,

	localidadNombre:string,
	localidadIdNumero:number,
	nombreEvento:string,
	servicio:number,
	utilizada:boolean,
	servicioIva:number,
	metodo:string,
	lastModifiedDate:Date,

}