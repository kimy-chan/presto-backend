import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { FlagE } from 'src/core-app/enums/flag';

@Schema({ collection: 'Usuario' })
export class Usuario {
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
  @Prop()
  usuario: string;

  @Prop()
  password: string;

  @Prop()
  direccion: string;

  @Prop({ type: String, enum: FlagE, default: FlagE.nuevo })
  flag: string;

  @Prop({ type: Types.ObjectId, ref: 'Rol' })
  rol: string;

  @Prop({ type: Date, default: Date.now() })
  fecha: Date;
}
export const usuarioSchema = SchemaFactory.createForClass(Usuario);
