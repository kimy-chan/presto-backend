import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types } from "mongoose"
import { FlagE } from "src/core-app/enums/flag"



@Schema({collection:'Lectura'})
export class Lectura {
        @Prop({type:Number, default:0})
    lecturaActual:number
      @Prop({type:Number, default:0})
    lecturaAnterior:number

          @Prop({type:Types.ObjectId, default:'Medidor'})
    medidor:Types.ObjectId

     @Prop({type:String, enum:FlagE, default:FlagE.nuevo})
            flag:string
        
            @Prop({type:Date, default:Date.now() })
            fecha:Date



}

export const lecturaSchema = SchemaFactory.createForClass(Lectura)
