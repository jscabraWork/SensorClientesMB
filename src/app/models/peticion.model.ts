import { Foto } from "./foto.model";

export class Peticion{
    id:number;
    autorizador:string;
    comprobante:Foto;
    accion:string;
    implicacion:string;
    creationDate:Date

}