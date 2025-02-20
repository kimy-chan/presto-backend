import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { FlagE } from 'src/core-app/enums/flag';
import { EstadoE } from '../enum/estadoE';

@Schema({ collection: 'Pago' })
export class Pago {
  @Prop()
  codigo: string;
  @Prop()
  lectura: Types.ObjectId;
  @Prop({ default: 0 })
  costoPagado: number;
  @Prop()
  observaciones: string;
  @Prop()
  aqo: string;

  @Prop({ type: String, enum: EstadoE })
  estado: string;

  @Prop({ type: Types.ObjectId, default: 'Usuario' })
  usuario: Types.ObjectId;

  @Prop({ type: String, enum: FlagE, default: FlagE.nuevo })
  flag: string;

  @Prop({ type: Date, default: Date.now() })
  fecha: Date;
}

export const pagoSchema = SchemaFactory.createForClass(Pago);
