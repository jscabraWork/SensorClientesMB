export class Forma {
  id?:number;
  ancho: number;
  alto: number;
  color: string;
  color_de_texto: string;
  margen_r: number;
  margen_l: number;
  margen_t: number;
  margen_b: number;
  color_de_borde?: string;
  redondeado: number;
  font_size: number;
  rotacion: number;
  salto: number;    
  tipo: number;
  type?: "forma"|"arco"|"arco-r";
}

export class Arco extends Forma {
radio_x: number;
radio_y: number;
grosor: number;
altoArco: number;
anchoArco: number;
posicionTexto: number;
}

export class ArcoRadio extends Forma {
radioSuperiorDerecho: number;
radioSuperiorIzquierdo: number;
radioInferiorDerecho: number;
radioInferiorIzquierdo: number;
}