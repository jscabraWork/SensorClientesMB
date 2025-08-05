import { Foto } from "./foto.model";

export class EntregaDinero{
    id:number;
    autorizador:string;
    comprobante:Foto
    dineroEntregado:number;
	cuatroPorMilYCostos:number;
    creationDate:Date;
    concepto:string;
}