import { Foto } from "./foto.model";

export class Accion{
    id:number;
    autorizador:string;
    comprobante:Foto
    localidadYCantidad:string;
    correoCelular:string;
    creationDate:Date
    producto:string;
	motivo:string;
	valor:number;
    accion:string;
    implicacion:string;
    dineroEntregado:number;
	cuatroPorMilYCostos:number;
}