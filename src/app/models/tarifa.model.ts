import { Evento } from "./evento.model"
import { Localidad } from "./localidad.model"

export class Tarifa {
    id: number
    nombre: string
    precio: number
    servicio: number
    iva: number
    estado: number
    localidad: Localidad

    /**
     * Calcula el precio total multiplicando (precio + servicio + iva) por la cantidad de asientos
     * @param cantidad - Número de asientos para calcular el precio total
     * @returns El precio total calculado
     */
    getPrecioTotal(cantidad: number): number {
        return (this.precio + this.servicio + this.iva) * cantidad;
    }
}
