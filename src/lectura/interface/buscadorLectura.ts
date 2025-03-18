export interface BuscadorLecturaI {
  numeroMedidor?: string;

  estado?: string;

  fecha?: {
    $gte: Date;

    $lte: Date;
  };
}
