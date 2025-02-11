import { Module } from '@nestjs/common';
import { CategoriaGastoService } from './categoria-gasto.service';
import { CategoriaGastoController } from './categoria-gasto.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriaGasto, categoriaGastoSchema } from './schema/categoriaGasto.schema';

@Module({
   imports:[
      MongooseModule.forFeature([
        {
          name:CategoriaGasto.name, schema:categoriaGastoSchema
        }
      ])
    ],
  controllers: [CategoriaGastoController],
  providers: [CategoriaGastoService],
})
export class CategoriaGastoModule {}
