import { Types } from 'mongoose';

export interface PagoI {
  lectura: Types.ObjectId;
  costoPagado?: number;
  observaciones?: string;
  aqo: string;
  costoApagar: number;
  codigo: string;
}
