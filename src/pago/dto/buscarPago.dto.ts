import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class BuscarPagoDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  ci: string;
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  numeroMedidor: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  codigo: string; //codigo de la lectura
}
