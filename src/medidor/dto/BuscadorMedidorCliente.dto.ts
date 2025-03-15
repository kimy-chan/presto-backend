import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginadorDto } from 'src/core-app/dto/Paginador.dto';
import { EstadoMedidorE } from '../enums/estados';

export class BuscadorMedidorClienteDto extends PaginadorDto {
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

  @IsEnum(EstadoMedidorE)
  @IsOptional()
  estado: string;
}
