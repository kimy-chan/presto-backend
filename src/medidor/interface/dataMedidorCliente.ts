import { Types } from 'mongoose';

export interface DataMedidorCliente {
  _id: Types.ObjectId;
  numeroMedidor: string;
  ci: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  direccion: string;

  tarifaNombre?: string;
}
