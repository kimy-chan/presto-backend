import { Module } from '@nestjs/common';
import { PagoService } from './pago.service';
import { PagoController } from './pago.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pago, pagoSchema } from './schemas/pago.schema';
import { LecturaModule } from 'src/lectura/lectura.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Pago.name,
        schema: pagoSchema,
      },
    ]),
    LecturaModule,
  ],
  controllers: [PagoController],
  providers: [PagoService],
  exports: [PagoService],
})
export class PagoModule {}
