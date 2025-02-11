import { IsMongoId, IsNotEmpty, IsString } from "class-validator"
import { Types } from "mongoose"

export class CreateMedidorDto {
 
        codigo:string
    
         @IsString({ message: 'El número de serie debe ser un texto válido' })
    @IsNotEmpty({ message: 'El número de serie no puede estar vacío' })
    numeroSerie: string;

    @IsMongoId({ message: 'El cliente debe ser un ID de MongoDB válido' })
    @IsNotEmpty({ message: 'El cliente es obligatorio' })
    cliente: Types.ObjectId;
}
