import { BadRequestException, Module } from '@nestjs/common';
import { ClienteModule } from './cliente/cliente.module';
import { AutenticacionModule } from './autenticacion/autenticacion.module';
import { GastoModule } from './gasto/gasto.module';
import { TarifaModule } from './tarifa/tarifa.module';
import { PagoModule } from './pago/pago.module';
import { UsuarioModule } from './usuario/usuario.module';
import { CoreAppModule } from './core-app/core-app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MedidorModule } from './medidor/medidor.module';
import { CategoriaGastoModule } from './categoria-gasto/categoria-gasto.module';
import { LecturaModule } from './lectura/lectura.module';
import { RolModule } from './rol/rol.module';
import { PermisoModule } from './permiso/permiso.module';
import { APP_GUARD } from '@nestjs/core';
import { TokenGuard } from './autenticacion/guards/token/token.guard';
import { PermisoGuard } from './autenticacion/guards/permiso/permiso.guard';
import { ConfigModule } from '@nestjs/config';
import { coneccionBasesDeDatos } from './config/config';

if (!coneccionBasesDeDatos) {
  throw new BadRequestException('Ingrese la coneccion a la base de datos');
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(coneccionBasesDeDatos),

    ClienteModule,

    AutenticacionModule,

    GastoModule,

    TarifaModule,

    PagoModule,

    UsuarioModule,

    CoreAppModule,

    MedidorModule,

    CategoriaGastoModule,

    LecturaModule,

    RolModule,

    PermisoModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: TokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermisoGuard,
    },
  ],
})
export class AppModule {}
