import { Seccion } from "./seccion.model";
import { Leyenda } from "./leyendamapa.model";
export class Mapa {
    id: number;
    nombre: string;
    ancho: number;
    alto: number;
    eventoId: number;
    secciones: Seccion[];
    leyendas: Leyenda[];
  }