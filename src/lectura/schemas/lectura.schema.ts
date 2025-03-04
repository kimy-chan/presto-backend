import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { FlagE } from 'src/core-app/enums/flag';
import { EstadoMedidorE } from 'src/medidor/enums/estados';
import { EstadoLecturaE } from '../enums/estadoLectura';

@Schema({ collection: 'Lectura' })
export class Lectura {
  @Prop()
  codigo: string;

  @Prop()
  numeroLectura: string;

  @Prop()
  mes: string;

  @Prop({ type: Number, default: 0 })
  lecturaActual: number;
  @Prop({ type: Number, default: 0 })
  lecturaAnterior: number;

  @Prop({ type: Number, default: 0 })
  consumoTotal: number;

  @Prop({ type: Number, default: 0 })
  costoApagar: number;
  @Prop()
  gestion: string;

  @Prop({
    type: String,
    enum: EstadoLecturaE,
    default: EstadoLecturaE.PENDIENTE,
  })
  estado: string;

  @Prop({ type: Types.ObjectId, default: 'Medidor' })
  medidor: Types.ObjectId;

  @Prop({ type: Types.ObjectId, default: 'Usuario' })
  usuario: Types.ObjectId;

  @Prop({ type: String, enum: FlagE, default: FlagE.nuevo })
  flag: string;

  @Prop({ type: Date, default: Date.now() })
  fecha: Date;

  @Prop({ type: Date })
  fechaVencimiento: Date;
}

export const lecturaSchema = SchemaFactory.createForClass(Lectura);
