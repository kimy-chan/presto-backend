import { Transform } from 'class-transformer';
import { IsOptional, IsString, ValidateIf } from 'class-validator';
import { PaginadorDto } from 'src/core-app/dto/Paginador.dto';

export class BuscarPagoClienteDto extends PaginadorDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.trim())
  ci: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.trim())
  nombre: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.trim())
  apellidoPaterno: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.trim())
  apellidoMaterno: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.trim())
  numeroMedidor: string;

  @IsString()
  @IsOptional()
  @ValidateIf((o: BuscarPagoClienteDto) => !o.fechaFin)
  fechaInicio: string;

  @IsString()
  @IsOptional()
  @ValidateIf((o: BuscarPagoClienteDto) => !o.fechaInicio)
  fechaFin: string;
}
