export interface BuscadorClienteI {
  codigo?: string;

  ci?: RegExp;

  nombre?: RegExp;

  apellidoPaterno?: RegExp;

  apellidoMaterno?: RegExp;
}
