import { SetMetadata } from '@nestjs/common';
import { PERMISO_KEY } from '../constants/constants';
import { PermisosE } from 'src/core-app/enums/permisos';

export const Permiso = (permiso: PermisosE[]) =>
  SetMetadata(PERMISO_KEY, permiso);
