import { Types } from 'mongoose';

export interface BuscadorUsuarioI {
  ci?: RegExp;

  nombre?: RegExp;

  apellidoMaterno?: RegExp;

  apellidoPaterno?: RegExp;

  rol?: Types.ObjectId;
}
