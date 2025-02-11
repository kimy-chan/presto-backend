import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Gasto } from './schema/gasto.schema';
import { Model } from 'mongoose';
import { FlagE } from 'src/core-app/enums/flag';

@Injectable()
export class GastoService {
  constructor(@InjectModel(Gasto.name) private readonly gasto:Model<Gasto>){}
  async create(createGastoDto: CreateGastoDto) {
    createGastoDto.costoAqo = createGastoDto.cantidad * createGastoDto.costoUnitario
    await this.gasto.create(createGastoDto)
    return {status:HttpStatus.CREATED};
  }

  async findAll() {
    const gasto = await this.gasto.find({flag:FlagE.nuevo})
    return gasto;
  }

  findOne(id: number) {
    return `This action returns a #${id} gasto`;
  }

  update(id: number, updateGastoDto: UpdateGastoDto) {
    return `This action updates a #${id} gasto`;
  }

  remove(id: number) {
    return `This action removes a #${id} gasto`;
  }
}
