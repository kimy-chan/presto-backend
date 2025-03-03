import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AutenticacionDto } from './dto/autenticacion.dto';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AutenticacionService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}
  async autenticacion(autenticacionDto: AutenticacionDto) {
    const usuario = await this.usuarioService.verificarUsuario(
      autenticacionDto.usuario,
    );
    if (!usuario) {
      throw new UnauthorizedException('Verifique sus credenciales');
    }
    const verificarContrasena = await argon2.verify(
      usuario.password,
      autenticacionDto.password,
    );
    if (verificarContrasena) {
      const token = await this.jwtService.signAsync({
        id: usuario._id,
        rol: usuario.rol,
      });
      return { status: HttpStatus.OK, token };
    }

    throw new UnauthorizedException('Verifique sus credenciales');
  }
}
