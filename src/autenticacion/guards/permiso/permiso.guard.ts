import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import {
  PERMISO_KEY,
  PUBLIC_INTERNO_KEY,
  PUBLIC_KEY,
} from 'src/autenticacion/constants/constants';
import { PermisosE } from 'src/core-app/enums/permisos';
import { RolService } from 'src/rol/rol.service';

@Injectable()
export class PermisoGuard implements CanActivate {
  constructor(
    private readonly rolService: RolService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest();

      const publico = this.reflector.get(PUBLIC_KEY, context.getHandler());

      if (publico) {
        return true;
      }

      const publicoInterno = this.reflector.get(
        PUBLIC_INTERNO_KEY,
        context.getHandler(),
      );

      if (publicoInterno) {
        return true;
      }

      const permisos = this.reflector.get<PermisosE[]>(
        PERMISO_KEY,
        context.getHandler(),
      );

      const rol = await this.rolService.veririficarRol(request.rol);

      if (rol) {
        return permisos.some((permiso) => rol.permisos.includes(permiso));
      }
      throw new UnauthorizedException();
    } catch (error) {
      console.log(error);

      throw new UnauthorizedException();
    }
  }
}
