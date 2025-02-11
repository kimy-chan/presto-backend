import { Module } from '@nestjs/common';
import { GastoService } from './gasto.service';
import { GastoController } from './gasto.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Gasto, gastoSchema } from './schema/gasto.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name:Gasto.name, schema:gastoSchema
      }
    ])
  ],
  controllers: [GastoController],
  providers: [GastoService],
})
export class GastoModule {}
