import { Transform } from 'class-transformer';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { PaginadorDto } from 'src/core-app/dto/Paginador.dto';

export class BuscadorLecturaDto extends PaginadorDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.trim())
  numeroMedidor: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.trim().toUpperCase())
  estado: string;

  @IsDateString()
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.trim())
  fechaInicio: string;

  @IsDateString()
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.trim())
  fechaFin: string;
}
