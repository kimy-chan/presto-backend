import { Module } from '@nestjs/common';
import { LecturaConsumoService } from './lectura-consumo.service';
import { LecturaConsumoController } from './lectura-consumo.controller';

@Module({
  controllers: [LecturaConsumoController],
  providers: [LecturaConsumoService],
})
export class LecturaConsumoModule {}
