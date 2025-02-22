import { IsNumber, IsNumberString, IsOptional } from 'class-validator';

export class PaginadorDto {
  @IsNumberString()
  @IsOptional()
  pagina = 1;

  @IsNumberString()
  @IsOptional()
  limite = 20;
}
