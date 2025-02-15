import { Module } from '@nestjs/common';
import { LecturaService } from './lectura.service';
import { LecturaController } from './lectura.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lectura, lecturaSchema } from './schemas/lectura.schema';

@Module({
    imports:[MongooseModule.forFeature([
        {
          name:Lectura.name, schema:lecturaSchema
        }
      ])],
  controllers: [LecturaController],
  providers: [LecturaService],
})
export class LecturaModule {}
