import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator"
import { RangoDto } from "./rangoTariga.dto"
import { Transform, Type } from "class-transformer"

export class CreateTarifaDto {
    @IsString()
    @Transform(({value}:{value:string})=> value.toUpperCase())
    @IsNotEmpty()
    nombre:string
    @IsArray()
    @ValidateNested({each:true})
    @Type(()=>RangoDto)
    rangos:RangoDto[]
}
