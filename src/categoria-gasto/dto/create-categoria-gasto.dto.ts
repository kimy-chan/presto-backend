import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoriaGastoDto {
    @IsString()
    @IsNotEmpty()
    nombre:string
}
