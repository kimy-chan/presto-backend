import { Transform } from 'class-transformer';
import { IsInt, IsNumberString, IsOptional } from 'class-validator';

export class PaginadorDto {
  @IsInt()
  @IsOptional()
  @Transform(({ value }: { value: string }) => Number(value))
  pagina: number = 1;

  @IsInt()
  @IsOptional()
  @Transform(({ value }: { value: string }) => Number(value))
  limite: number = 20;
}
