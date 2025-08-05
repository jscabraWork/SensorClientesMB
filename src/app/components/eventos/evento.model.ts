import { Etapa } from './eventos-perfil/etapa.model';
import { Localidad } from '../../models/localidad.model';
import { Foto } from '../../models/foto.model';
import { Adicionales } from '../../models/adicionales.model';
import { Ciudad } from '../../models/ciudad.model';

export class Evento {
    id!: number;
    pulep!: string;
    nombre!: string;
    fecha!: Date;
    descripcion!: string;
    lugar!: string;
    video!: string;
    terminosYCondiciones!: string;
    recomendaciones!: string;
    
    
    imagenes: Foto[] = [];
    artistas: any;
    fechaFin!: Date;
    mapa!: string;
    localidades!: Localidad[];    
    horaInicio!: string;
    horaApertura!: string;
    horaFin!: string;
    etapas!: Etapa[];
    
    visible!: boolean;
    soldOut!: boolean;
    mensaje!: string;
    
    fechaApertura!: Date;
    urlMapa!: string;
    oculto!: boolean;
    
    visibleAP!: boolean;
    visibleAC!: boolean;
    visibleAS!: boolean;
    terminado!: boolean;
    imprimir!: boolean;
    visibleMin!: boolean;
    tipo!: string;
    adicionales!: Adicionales[];
    fechaCambioEtapa!: Date;
    metaPixel!: string;
    googleAnalytic!: string;
    mapa_id!: number;

    ciudad!: Ciudad;

    getImagenePorTipo(tipo: number): Foto | undefined {
    if (!this.imagenes) return undefined;
    return this.imagenes.find(img => img.tipo === tipo);
}
}