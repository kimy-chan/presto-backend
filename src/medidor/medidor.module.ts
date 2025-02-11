import { Module } from '@nestjs/common';
import { MedidorService } from './medidor.service';
import { MedidorController } from './medidor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Medidor, medidorSchema } from './schema/medidor.schema';

@Module({
    imports:[MongooseModule.forFeature([
      {
        name:Medidor.name, schema:medidorSchema
      }
    ])],
  controllers: [MedidorController],
  providers: [MedidorService],
})
export class MedidorModule {}
