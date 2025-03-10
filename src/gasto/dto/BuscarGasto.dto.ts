import {
  IsDateString,
  IsMongoId,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { Types } from 'mongoose';
import { PaginadorDto } from 'src/core-app/dto/Paginador.dto';

export class BuscadorGasto extends PaginadorDto {
  @IsMongoId()
  @IsOptional()
  categoriaGasto: Types.ObjectId;

  @IsDateString()
  @IsOptional()
  @ValidateIf((o: BuscadorGasto) => !o.fechaFin)
  fechaInicio: string;

  @IsDateString()
  @IsOptional()
  @ValidateIf((o: BuscadorGasto) => !o.fechaInicio)
  fechaFin: string;
}
