import { Dia } from "./dia.model"
import { Organizador } from "./organizador.model"
import { Tipo } from "./tipo.model"
import { Venue } from "./venue.model"
import { Imagen } from "./imagen.model"

export class Evento {
    id: number
    pulep: string
    artistas: string
    nombre: string
    recomendaciones: string
    video: string
    fechaApertura: Date
    estado: number
    venue: Venue
    organizadores: Organizador[]
    dias: Dia[]
    tipo: Tipo
    imagenes: Imagen[] = [];

    getImagenePorTipo(tipo: number): Imagen | undefined {
        if (!this.imagenes || this.imagenes.length === 0) {
            return undefined;
        }
        return this.imagenes.find(imagen => imagen.tipo === tipo);
    }
}