import { Seccion } from './seccion.model';

export interface SeccionPlana extends Seccion {
  margen_t: number;
  margen_b: number;
  margen_r: number;
  margen_l: number;
  salto: number;
}