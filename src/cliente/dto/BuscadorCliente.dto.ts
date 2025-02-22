import { IsOptional, IsString } from 'class-validator';
import { PaginadorDto } from 'src/core-app/dto/Paginador.dto';

export class BuscadorClienteDto extends PaginadorDto {
  @IsString()
  @IsOptional()
  codigo: string;

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
}
