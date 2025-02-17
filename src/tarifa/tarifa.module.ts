import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { Tarifa, tarifaSchema } from './schema/tarifa.schema';
import { Rango, rangoSchema } from './schema/rango.schema';
import { TarifaController } from './controllers/tarifa.controller';
import { TarifaService } from './services/tarifa.service';
import { RangoController } from './controllers/rango.controller';
import { RangoService } from './services/rango.service';

@Module({
      imports:[MongooseModule.forFeature([
        {
          name:Tarifa.name, schema:tarifaSchema
        },

        {
          name:Rango.name, schema:rangoSchema
        }
      ])],
  controllers: [TarifaController, RangoController],
  providers: [TarifaService, RangoService],
  exports:[RangoService]
})
export class TarifaModule {}
