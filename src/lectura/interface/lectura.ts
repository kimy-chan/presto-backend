import { Types } from 'mongoose';

export interface LecturaI {
  lecturaActual: number;

  lecturaAnterior: number;

  medidor: Types.ObjectId;

  codigo: number;

  consumoTotal: number;

  mes: string;

  gestion: string;

  numeroLectura: number;

  costoApagar: number;
}
