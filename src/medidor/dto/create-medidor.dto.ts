import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { EstadoMedidorE } from '../enums/estados';
import { Transform } from 'class-transformer';

export class CreateMedidorDto {
  codigo: number;

  @IsString({ message: 'El número de serie debe ser un texto válido' })
  @IsNotEmpty({ message: 'El número de serie no puede estar vacío' })
  @Transform(({ value }: { value: string }) => value.trim())
  numeroMedidor: string;

  @IsMongoId({ message: 'El cliente debe ser un ID de MongoDB válido' })
  @IsNotEmpty({ message: 'El cliente es obligatorio' })
  cliente: Types.ObjectId;

  @IsMongoId({ message: 'El tarifa debe ser un ID de MongoDB válido' })
  @IsNotEmpty({ message: 'El tarifa es obligatorio' })
  tarifa: Types.ObjectId;

  @IsDateString()
  @IsNotEmpty()
  fechaInstalacion: string;

  @IsString()
  @IsOptional()
  descripcion: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  direccion: string;

  @IsEnum(EstadoMedidorE)
  @IsOptional()
  estado: string;
}
