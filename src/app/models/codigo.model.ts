
export class Codigo {
   
    id:number;
    numeroDocumento: string;
    nombre: string;
    correo:string;
    tipoDocumento: TipoDocumento;
    contrasena:string;
    celular:string;
    activo: boolean;
    publicidad: boolean;
}

export class TipoDocumento {
   
    id:number;
    nombre: string;
}

