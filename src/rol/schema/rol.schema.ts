import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FlagE } from 'src/core-app/enums/flag';

@Schema({ collection: 'Rol' })
export class Rol {
  @Prop()
  nombre: string;
  @Prop()
  permisos: string[];

  @Prop({ type: String, enum: FlagE, default: FlagE.nuevo })
  flag: string;

  @Prop({ type: Date, default: Date.now() })
  fecha: Date;
}

export const RolSchema = SchemaFactory.createForClass(Rol);
