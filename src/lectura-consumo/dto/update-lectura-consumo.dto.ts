import { PartialType } from '@nestjs/mapped-types';
import { CreateLecturaConsumoDto } from './create-lectura-consumo.dto';

export class UpdateLecturaConsumoDto extends PartialType(CreateLecturaConsumoDto) {}
