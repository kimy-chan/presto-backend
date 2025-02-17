import { Types } from "mongoose"

export interface DataMedidorI {
    _id:Types.ObjectId,
       estado:string,
              nombre:string,
              codigoCliente:string,
              apellidoPaterno:string,
              ci:string,
              apellidoMaterno:string,
              numeroMedidor:string,
              direccion:string
              codigo:string
              lecturaAnterior:number

}