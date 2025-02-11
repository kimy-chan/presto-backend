import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform } from "class-transformer";
import { FlagE } from "src/core-app/enums/flag";

@Schema({collection:"Tarifa"})
export class Tarifa {
    @Prop()
    nombre:string

       @Prop({type:String, enum:FlagE, default:FlagE.nuevo})
        flag:string
    
        @Prop({type:Date, default:Date.now() })
        fecha:Date
    
}
export const tarifaSchema =SchemaFactory.createForClass(Tarifa)