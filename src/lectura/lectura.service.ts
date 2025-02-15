import { Injectable } from '@nestjs/common';
import { CreateLecturaDto } from './dto/create-lectura.dto';
import { UpdateLecturaDto } from './dto/update-lectura.dto';

@Injectable()
export class LecturaService {
  create(createLecturaDto: CreateLecturaDto) {
    return 'This action adds a new lectura';
  }

  findAll() {
    return `This action returns all lectura`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lectura`;
  }

  update(id: number, updateLecturaDto: UpdateLecturaDto) {
    return `This action updates a #${id} lectura`;
  }

  remove(id: number) {
    return `This action removes a #${id} lectura`;
  }
}
