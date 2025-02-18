import { Transform } from "class-transformer"
import { IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator"
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

         @IsString()
        @IsNotEmpty()
        @Transform(({value}:{value:string})=> value.toUpperCase())
        mes:string
       
}
