import { Cliente } from "./cliente.model";
import { Localidad } from "./localidad.model";
import { Orden } from "./orden.model";
import { Seguro } from "./seguro.model";
import { Tarifa } from "./tarifa.model";

export class Ticket {
   id:number;
  // 0: DISPONIBLE, 1: VENDIDO, 2: RESERVADO, 3: EN PROCESO, 4: NO DISPONIBLE
  estado:number;
  // 0: TICKET COMPLETO, 1: TICKET MASTER DE PALCOS INDIVIDUALES
  tipo:number;
  numero: String;
  asientos: Ticket[];  // Relación Master-Slave: Master
  palco: Ticket | null;      // Relación Master-Slave: Slave reference to Master
  cliente: Cliente | null;
  seguro: Seguro | null;
  tarifa: Tarifa | null;
  localidad: Localidad | null;
  utilizado: boolean;

  //Variables auxiliares para la compra desde mapas
  personasPorTicket: number | null;
  asientosDisponibles: number | null;

  /**
   * Calcula el precio total del ticket basado en su tarifa
   * Si personasPorTicket es null, devuelve solo los valores de la tarifa sin multiplicar
   * Si personasPorTicket tiene valor, multiplica por esa cantidad
   * @returns El precio total calculado o 0 si no hay tarifa
   */
  getPrecioTotal(): number {
    if (!this.tarifa) {
      return 0;
    }
    const precioBase = this.tarifa.getPrecioTotal(1); // Precio base de la tarifa
    
    if (this.personasPorTicket === null) {
      return precioBase;
    }
    return precioBase * this.personasPorTicket;
  }

}
