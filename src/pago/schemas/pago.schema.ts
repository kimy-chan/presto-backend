import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { FlagE } from "src/core-app/enums/flag";

@Schema({collection:'Pago'})
export class Pago {
    @Prop()
    lectura:Types.ObjectId
    @Prop()
    costoPagado:number
    @Prop()
    observaciones:string
     @Prop()
    aqo:string
     @Prop()
    costoApagar:number

       @Prop({type:String, enum:FlagE, default:FlagE.nuevo})
            flag:string
        
            @Prop({type:Date, default:Date.now() })
            fecha:Date
}

export const pagoSchema= SchemaFactory.createForClass(Pago)