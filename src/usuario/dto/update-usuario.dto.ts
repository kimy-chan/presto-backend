import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './createUsuario.dto';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}
