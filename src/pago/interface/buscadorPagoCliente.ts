export interface BuscadorPagosClienteI {
  ci?: string;

  nombre?: RegExp;

  apellidoPaterno?: RegExp;

  apellidoMaterno?: RegExp;

  numeroMedidor?: string;

  fecha?: {
    $gte: Date;
    $lte: Date;
  };
}
