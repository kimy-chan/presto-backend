import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FlagE } from 'src/core-app/enums/flag';

@Schema({ collection: 'Cliente' })
export class Cliente {
  @Prop()
  codigo: string;

  @Prop()
  ci: string;

  @Prop()
  nombre: string;

  @Prop()
  celular: string;

  @Prop()
  apellidoMaterno: string;

  @Prop()
  apellidoPaterno: string;

  //@Prop()
  // direccion:string

  @Prop({ type: String, enum: FlagE, default: FlagE.nuevo })
  flag: string;

  @Prop({ type: Date, default: Date.now() })
  fecha: Date;
}

export const clienteSchema = SchemaFactory.createForClass(Cliente);
