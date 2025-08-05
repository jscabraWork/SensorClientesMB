import { Informativo } from './informativo-mapas.model';
import { Fila } from './fila-mapas.model';
import { LocalidadMapa } from './localidadmapa.model';
export interface Seccion {
    id?: number;
    tipo: 'plana' | 'inclinada';
    rotacion: number;
    filas: Fila[];
    localidadMapas: LocalidadMapa[];
    informativos: Informativo[];
  }