import { NumberExpression, Types } from "mongoose"

export interface LecturaI{
     
            lecturaActual:number
          
            lecturaAnterior:number
         
            medidor:Types.ObjectId
       
            codigo:number

            consumoTotal:NumberExpression

            mes:string
    
}