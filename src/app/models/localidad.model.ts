import { Dia } from "./dia.model"
import { Tarifa } from "./tarifa.model"

export class Localidad {
    id: number
    nombre: string
    descripcion: string | null = null
    tipo: number
    tarifas: Tarifa[] = []
    dias: Dia[] = []
    aporteMinimo: number;

    // Datos para la compra
    // Este atributo es auxiliar para la compra
    tarifa: Tarifa | null = null
}
