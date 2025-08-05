import { Ticket } from "../ticket.model";
export interface Fila {
    id?: number;
    nombre: string;
    ancho_de_asiento: number;
    alto_de_asiento: number;
    separacion_entre_asientos: number;
    redondeado_de_asiento: number;
    color_de_texto: string;
    font_size: number;
    margen_r: number;
    margen_l: number;
    margen_t: number;
    margen_b: number;
    direccion: number;
    inclinacion: number;
    curvatura: number;
    direccion_de_curvatura: number;
    color_de_borde: string;
    color: string;
    salto: number;
    tickets: Ticket[];
  }