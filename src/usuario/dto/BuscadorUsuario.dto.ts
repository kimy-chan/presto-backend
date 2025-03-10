import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { PaginadorDto } from 'src/core-app/dto/Paginador.dto';

export class BuscadorUsuarioDto extends PaginadorDto {
  @IsString()
  @IsOptional()
  ci: string;

  @IsString()
  @IsOptional()
  nombre: string;

  @IsString()
  @IsOptional()
  apellidoMaterno: string;

  @IsString()
  @IsOptional()
  apellidoPaterno: string;

  @IsMongoId()
  @IsOptional()
  rol: Types.ObjectId;
}
