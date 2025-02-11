import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { FlagE } from "src/core-app/enums/flag";
import { EstadoMedidorE } from "../enums/estados";


@Schema({collection:'Medidor'})
export class Medidor {

     @Prop()
    codigo:string

    @Prop()
    numeroSerie:string

     @Prop({type:String, enum:EstadoMedidorE, default:EstadoMedidorE.activo})
    estado:string

     @Prop({type:Types.ObjectId, ref:'Cliente'})
    cliente:Types.ObjectId

     @Prop({type:String, enum:FlagE, default:FlagE.nuevo})
        flag:string
    
        @Prop({type:Date, default:Date.now() })
        fecha:Date
}

export const medidorSchema = SchemaFactory.createForClass(Medidor)