import { Module } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { AutenticacionController } from './autenticacion.controller';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/constants';
import { RolModule } from 'src/rol/rol.module';

@Module({
  imports: [
    UsuarioModule,

    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
    }),
    RolModule,
  ],
  controllers: [AutenticacionController],
  providers: [AutenticacionService],
})
export class AutenticacionModule {}
