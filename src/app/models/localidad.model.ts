
import { Etapa } from "../components/eventos/eventos-perfil/etapa.model";

export class Localidad {
    id:number;
    nombre: string;
    precio:number;
    estado:number;
    servicio:number;
    servicio_iva:number;
    efectivo:boolean;
    maximoVender:number;
    vaca:boolean;
    visibleMin:boolean;
    precioMin:number;
    vendidoMin:number;
	soldout:boolean;
    precioProximaEtapa:number;
    pagoMinimo:number;
    tipo:number;
    etapa:Etapa;
    cantidadPersonasPorTicket:number;
}
