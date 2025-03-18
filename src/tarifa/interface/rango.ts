import { Types } from 'mongoose';

export interface RangoI {
  rango1: number;

  rango2: number;

  costo: number;

  tarifa: Types.ObjectId;

  iva: number;
}
