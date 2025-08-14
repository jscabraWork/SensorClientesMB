import { Evento } from "./evento.model"
import { Localidad } from "./localidad.model"

export class Dia {
    id: number
    nombre: string
    fechaInicio: String
    fechaFin: String
    horaInicio: string
    horaFin: string
    localidades: Localidad[]
    evento: Evento
}