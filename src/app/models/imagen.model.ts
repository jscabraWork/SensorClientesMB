export class Imagen {
  id: number;
  nombre: string;
  url: string;
  tipo: number = 0;

  constructor(id: number, nombre: string, url: string) {
    this.id = id;
    this.nombre = nombre;
    this.url = url;
    this.tipo = 1; // Default value for tipo
  }
}