import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { FlagE } from "src/core-app/enums/flag";

@Schema({collection:"Rango"})
export class Rango {
    @Prop({type:Number , default:0})
    rango1:number
    @Prop({type:Number , default:0})
    rango2:number
    @Prop({type:Types.ObjectId , ref:'Tarifa'})
    @Prop({type:Number , default:0})
    precio:number
    @Prop({type:Types.ObjectId , ref:'Tarifa'})
    tarifa:Types.ObjectId

       @Prop({type:String, enum:FlagE, default:FlagE.nuevo})
        flag:string
    
        @Prop({type:Date, default:Date.now() })
        fecha:Date
    

}

export const rangoSchema = SchemaFactory.createForClass(Rango)