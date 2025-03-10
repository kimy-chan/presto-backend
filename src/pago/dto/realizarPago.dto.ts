import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class RealizarPago {
  @IsMongoId()
  @IsNotEmpty()
  lectura: Types.ObjectId;

  @IsNumber()
  @IsNotEmpty()
  costoPagado: number;

  @IsString()
  @IsOptional()
  observaciones: string;

  numeroPago: string;

  usuario: Types.ObjectId;
}
