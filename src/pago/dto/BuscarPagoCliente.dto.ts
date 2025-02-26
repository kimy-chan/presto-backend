import { IsOptional, IsString } from 'class-validator';
import { PaginadorDto } from 'src/core-app/dto/Paginador.dto';

export class BuscarPagoClienteDto extends PaginadorDto {
  @IsString()
  @IsOptional()
  ci: string;

  @IsString()
  @IsOptional()
  nombre: string;

  @IsString()
  @IsOptional()
  apellidoPaterno: string;

  @IsString()
  @IsOptional()
  apellidoMaterno: string;

  @IsString()
  @IsOptional()
  numeroMedidor: string;

  @IsString()
  @IsOptional()
  fechaInicio: string;

  @IsString()
  @IsOptional()
  fechaFin: string;
}
