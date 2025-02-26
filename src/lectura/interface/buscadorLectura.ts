export interface BuscadorLecturaI {
  numeroMedidor?: string;

  mes?: string;

  fecha?: {
    $gte: Date;

    $lte: Date;
  };
}
