import { EstadoMedidorE } from '../enums/estados';

export interface BuscadorMedidorClienteI {
  ci?: RegExp;

  nombre?: RegExp;

  apellidoPaterno?: RegExp;

  apellidoMaterno?: RegExp;

  numeroMedidor?: string;

  estado?: string;
}
