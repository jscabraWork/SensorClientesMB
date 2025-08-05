import { Foto } from "./foto.model";

export interface Ciudad {
    id: number,
    nombre:string,
    imagen:Foto,
    temperatura:number,
    visible:boolean
}
