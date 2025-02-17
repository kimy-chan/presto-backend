
import { Types } from "mongoose"

export interface DataLecturaI {
     codigo: number,
  
  consumoTotal: number,
  medidor: Types.ObjectId,
  usuario:string,
    tarifa:Types.ObjectId

  _id:Types.ObjectId,
}