import { Prop, Schema } from "@nestjs/mongoose";
import { FlagE } from "src/core-app/enums/flag";

@Schema({collection:'Usuario'})
export class Usuario {
        @Prop()
    nombre:string



     @Prop()
        celular:string
    
        @Prop()
        apellidoMaterno:string
    
        @Prop()
        apellidoPaterno:string
            @Prop()
        usuario:string
        
            @Prop({select:false})
        password:string

             @Prop({type:String, enum:FlagE, default:FlagE.nuevo})
                flag:string
            
                @Prop({type:Date, default:Date.now() })
                fecha:Date
            
        

    

}
