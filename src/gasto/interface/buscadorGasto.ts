import { Types } from 'mongoose';

export interface BuscadorGastoI {
  categoriaGasto?: Types.ObjectId;
  fecha?: {
    $gte: Date;
    $lte: Date;
  };
}
