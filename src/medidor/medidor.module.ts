import { forwardRef, Module } from '@nestjs/common';
import { MedidorService } from './medidor.service';
import { MedidorController } from './medidor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Medidor, medidorSchema } from './schema/medidor.schema';
import { LecturaService } from 'src/lectura/lectura.service';
import { LecturaModule } from 'src/lectura/lectura.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Medidor.name,
        schema: medidorSchema,
      },
    ]),
    forwardRef(() => LecturaModule),
  ],
  controllers: [MedidorController],
  providers: [MedidorService],
  exports: [MedidorService],
})
export class MedidorModule {}
