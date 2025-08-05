import { Archivo } from "./archivo.model";

export class Borrador {
    id: number;
    pulep:string;
    nombre:string;
    fecha:Date;
    fechaFin:Date;
    descripcion:string;
    lugar:string;
    artistas:string;
    video:string;
    terminosYCondiciones:string;
    recomendaciones:string;
    horaInicio:string;
    horaFin:string;;
    horaApertura:string;;
    tipo:string;
    idCiudad:number;
    archivos:Archivo[]

}