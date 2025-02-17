import { IsMongoId, IsNotEmpty, IsNumber } from "class-validator"
import { Types } from "mongoose"

export class CreateLecturaDto {
        //cupero-----
       @IsNumber()
        @IsNotEmpty()
        lecturaActual:number
        @IsNumber()
        @IsNotEmpty()
        lecturaAnterior:number
        @IsMongoId()
        @IsNotEmpty()
        medidor:Types.ObjectId
       
}
