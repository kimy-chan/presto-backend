import { IsNotEmpty, IsNumber } from 'class-validator';
import { Types } from 'mongoose';

export class RangoDto {
  @IsNumber({}, { message: 'El campo "rango1" debe ser un número válido.' })
  @IsNotEmpty({ message: 'El campo "rango1" no puede estar vacío.' })
  rango1: number;

  @IsNumber({}, { message: 'El campo "rango2" debe ser un número válido.' })
  @IsNotEmpty({ message: 'El campo "rango2" no puede estar vacío.' })
  rango2: number;

  @IsNumber({}, { message: 'El campo "precio" debe ser un número válido.' })
  @IsNotEmpty({ message: 'El campo "precio" no puede estar vacío.' })
  costo: number;

  @IsNumber({}, { message: 'El campo "iva" debe ser un número válido.' })
  @IsNotEmpty({ message: 'El campo "iva" no puede estar vacío.' })
  iva: number;
}
