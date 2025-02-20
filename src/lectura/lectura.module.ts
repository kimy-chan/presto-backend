import { forwardRef, Module } from '@nestjs/common';
import { LecturaService } from './lectura.service';
import { LecturaController } from './lectura.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lectura, lecturaSchema } from './schemas/lectura.schema';
import { PagoModule } from 'src/pago/pago.module';
import { MedidorModule } from 'src/medidor/medidor.module';
import { TarifaModule } from 'src/tarifa/tarifa.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Lectura.name,
        schema: lecturaSchema,
      },
    ]),

    forwardRef(() => MedidorModule),
    TarifaModule,
  ],

  controllers: [LecturaController],
  providers: [LecturaService],
  exports: [LecturaService],
})
export class LecturaModule {}
