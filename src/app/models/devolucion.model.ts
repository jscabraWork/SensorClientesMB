import { Cliente } from "../usuario/cliente.model";
import { Foto } from "./foto.model";

export class Devolucion{
    id:number;
    autorizador:string;
    comprobante:Foto
    producto:string;
	motivo:string;
	valor:number;
    creationDate:Date;
}