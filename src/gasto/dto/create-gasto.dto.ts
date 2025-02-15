import { IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator"
import { Types } from "mongoose";

export class CreateGastoDto {
        
   @IsString({ message: 'La descripción debe ser un texto válido' })
    @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
    descripcion: string;

    @IsString({ message: 'La unidad de manejo debe ser un texto válido' })
    @IsNotEmpty({ message: 'La unidad de manejo no puede estar vacía' })
    unidadManejo: string;

    @IsNumber({}, { message: 'La cantidad debe ser un número válido' })
    @IsNotEmpty({ message: 'La cantidad no puede estar vacía' })
    cantidad: number;

    @IsNumber({}, { message: 'El costo unitario debe ser un número válido' })
    @IsNotEmpty({ message: 'El costo unitario no puede estar vacío' })
    costoUnitario: number;

    @IsNumber({}, { message: 'El factor de validez debe ser un número válido' })
    @IsNotEmpty({ message: 'El factor de validez no puede estar vacío' })
    factorValides: number;

    @IsMongoId()
    @IsNotEmpty()
    categoriaGasto: Types.ObjectId;

    costoAqo:number


    
       
}
