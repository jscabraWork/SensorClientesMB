import { Arco, Forma } from "./forma.model";

export class LocalidadMapa {
    id?: number;
    nombre: string;
    precio: number;
    localidadesIds?: LocalidadId[];
    nombre_localidad?: string;
    forma: Forma | Arco;
  }

  export class LocalidadId{
    id?: number
    nombre: string
  }