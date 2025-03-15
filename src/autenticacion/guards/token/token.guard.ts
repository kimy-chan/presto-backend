import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Types } from 'mongoose';
import { Observable } from 'rxjs';
import { PUBLIC_KEY } from 'src/autenticacion/constants/constants';
import { PayloadI } from 'src/autenticacion/interface/payload';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usuarioService: UsuarioService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const publico = this.reflector.get(PUBLIC_KEY, context.getHandler());
    if (publico) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    try {
      const token = request.headers.authorization?.split(' ')[1];
      if (token) {
        const payload: PayloadI = await this.jwtService.verifyAsync(token);

        const usuario = await this.usuarioService.verificarUsuarioId(
          payload.id,
        );

        if (usuario) {
          request.user = usuario._id;
          request.rol = new Types.ObjectId(usuario.rol);
          return true;
        }
        throw new UnauthorizedException();
      }

      throw new UnauthorizedException();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
