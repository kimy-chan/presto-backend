import { Injectable } from '@nestjs/common';
import { CreateLecturaConsumoDto } from './dto/create-lectura-consumo.dto';
import { UpdateLecturaConsumoDto } from './dto/update-lectura-consumo.dto';

@Injectable()
export class LecturaConsumoService {
  create(createLecturaConsumoDto: CreateLecturaConsumoDto) {
    return 'This action adds a new lecturaConsumo';
  }

  findAll() {
    return `This action returns all lecturaConsumo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lecturaConsumo`;
  }

  update(id: number, updateLecturaConsumoDto: UpdateLecturaConsumoDto) {
    return `This action updates a #${id} lecturaConsumo`;
  }

  remove(id: number) {
    return `This action removes a #${id} lecturaConsumo`;
  }
}
