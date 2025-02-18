import { IsNotEmpty, IsString } from "class-validator"

export class BuscarPagoDto {
    @IsString()
    @IsNotEmpty()
    ci:string
        @IsString()
    @IsNotEmpty()

    numeroMedidor:string

        @IsString()
    @IsNotEmpty()
    codigo:string //codigo de la lectura
}