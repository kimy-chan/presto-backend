import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { FlagE } from "src/core-app/enums/flag"

@Schema({collection:'CategoriaGasto'})
export class CategoriaGasto {
    @Prop()
    nombre:string
    @Prop({type:String, enum:FlagE, default:FlagE.nuevo})
    flag:string    
    @Prop({type:Date, default:Date.now() })
    fecha:Date 
}

export const categoriaGastoSchema = SchemaFactory.createForClass(CategoriaGasto)