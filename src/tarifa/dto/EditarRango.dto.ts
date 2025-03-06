import { PartialType } from '@nestjs/mapped-types';
import { RangoDto } from './rangoTariga.dto';

export class EditarRangoDto extends PartialType(RangoDto) {}
