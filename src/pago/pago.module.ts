import { Module } from '@nestjs/common';
import { PagoService } from './pago.service';
import { PagoController } from './pago.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pago, pagoSchema } from './schemas/pago.schema';
import { TarifaModule } from 'src/tarifa/tarifa.module';

@Module({
   imports:[MongooseModule.forFeature([
          {
            name:Pago.name, schema:pagoSchema
          }
        ]),
      TarifaModule
      ],
  controllers: [PagoController],
  providers: [PagoService],
  exports:[PagoService]
})
export class PagoModule {}
