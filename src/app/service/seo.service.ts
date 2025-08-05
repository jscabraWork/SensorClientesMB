import { Injectable, makeStateKey, TransferState } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(private meta:Meta, private title:Title, private transferState: TransferState) { }

  updateOgMetaTags(event: any) {
    // Crear una clave para almacenar estos metadatos
    const OG_METADATA_KEY = makeStateKey<any>('og-metadata');
    
    // Actualizar título
    this.title.setTitle(event.title);
    
    // Actualizar meta tags OG
    this.meta.updateTag({ property: 'og:title', content: event.title });
    this.meta.updateTag({ property: 'og:description', content: event.description });
    this.meta.updateTag({ property: 'og:image', content: event.imageUrl });
    this.meta.updateTag({ property: 'og:url', content: window.location.href });
    
    // WhatsApp específico
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    // Guardar en transferState para evitar parpadeo durante hidratación
    this.transferState.set(OG_METADATA_KEY, event);
  }
}
