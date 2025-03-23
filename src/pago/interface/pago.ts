import { Types } from 'mongoose';

export interface PagoI {
  lectura: Types.ObjectId;
  costoPagado?: number;
  observaciones?: string;
  aqo: string;
  costoApagar: number;
  codigo: string;
}

export interface PagosI {
  _id: Types.ObjectId;
  codigoCliente: string;
  ci: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  tarifa: string;
  codigoMedidor: string;
  numeroMedidor: string;
  medidor: string;
  lecturaActual: number;
  lecturaAnterior: number;
  consumoTotal: number;
  costoApagar: number;
  mes: string;
  estado: string;
  costoPagado: number;
  fecha: string;
  numeroPago: string;
}
