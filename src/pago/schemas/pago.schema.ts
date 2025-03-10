import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { FlagE } from 'src/core-app/enums/flag';
import { EstadoPagoE } from '../enum/estadoE';
import { TipoPagoE } from '../enum/tipoPago';

@Schema({ collection: 'Pago' })
export class Pago {
  @Prop()
  numeroPago: string;
  @Prop()
  lectura: Types.ObjectId;
  @Prop({ default: 0 })
  costoPagado: number;
  @Prop()
  observaciones: string;
  @Prop()
  gestion: string;

  @Prop({ type: String, enum: EstadoPagoE })
  estado: string;

  @Prop({ type: String, enum: TipoPagoE, default: TipoPagoE.efectivo })
  tipoPago: string;

  @Prop({ type: Types.ObjectId, ref: 'Usuario' })
  usuario: Types.ObjectId;

  @Prop({ type: String, enum: FlagE, default: FlagE.nuevo })
  flag: string;

  @Prop({ type: Date, default: Date.now() })
  fecha: Date;
}

export const pagoSchema = SchemaFactory.createForClass(Pago);
