import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/presto'),
    
  ClienteModule,
    
  AutenticacionModule,
    
  GastoModule,
    
  TarifaModule,
    
  PagoModule,
    
    
  UsuarioModule,
    
  CoreAppModule,
    
  MedidorModule,
    
  CategoriaGastoModule,
    
  LecturaModule
],
  controllers: [],
  providers: [],
})
export class AppModule {}
