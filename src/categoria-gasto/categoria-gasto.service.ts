import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoriaGastoDto } from './dto/create-categoria-gasto.dto';
import { UpdateCategoriaGastoDto } from './dto/update-categoria-gasto.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CategoriaGasto } from './schema/categoriaGasto.schema';
import { Model } from 'mongoose';
import { FlagE } from 'src/core-app/enums/flag';

@Injectable()
export class CategoriaGastoService {
  constructor(@InjectModel(CategoriaGasto.name ) private readonly categoriaGasto:Model<CategoriaGasto>){}
  async create(createCategoriaGastoDto: CreateCategoriaGastoDto) {
    await this.categoriaGasto.create(createCategoriaGastoDto)
    return {status:HttpStatus.CREATED}
  }

   async findAll() {
    const categorias = await this.categoriaGasto.find({flag:FlagE.nuevo})
    return categorias;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoriaGasto`;
  }

  update(id: number, updateCategoriaGastoDto: UpdateCategoriaGastoDto) {
    return `This action updates a #${id} categoriaGasto`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoriaGasto`;
  }
}
