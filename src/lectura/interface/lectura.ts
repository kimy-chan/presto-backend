import { Types } from 'mongoose';

export interface LecturaI {
  lecturaActual: number;

  lecturaAnterior: number;

  medidor: Types.ObjectId;
  usuario: Types.ObjectId;

  codigo: number;

  consumoTotal: number;

  mes: string;

  gestion: string;

  numeroLectura: number;

  costoApagar: number;
  fechaVencimiento: Date;
}

export interface EditarLecturaI extends Partial<LecturaI> {}
