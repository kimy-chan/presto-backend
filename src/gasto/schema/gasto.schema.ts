import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { FlagE } from "src/core-app/enums/flag";

@Schema({collection:'Gasto'})
export class Gasto {

    @Prop()
    descripcion:string
    @Prop()
    unidadManejo:string
    @Prop()
    cantidad:number
    @Prop()
    costoUnitario:number
    @Prop()
    factorValides:number

    @Prop()
    costoAqo:number

       @Prop({type:Types.ObjectId, ref:'Usuario'})
    usuario:Types.ObjectId

           @Prop({type:Types.ObjectId, ref:'CategoriaGasto'})
    categoriaGasto:Types.ObjectId

        @Prop({type:String, enum:FlagE, default:FlagE.nuevo})
        flag:string
    
        @Prop({type:Date, default:Date.now() })
        fecha:Date
    

}

export const gastoSchema = SchemaFactory.createForClass(Gasto)