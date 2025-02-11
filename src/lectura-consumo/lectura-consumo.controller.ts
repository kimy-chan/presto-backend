import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LecturaConsumoService } from './lectura-consumo.service';
import { CreateLecturaConsumoDto } from './dto/create-lectura-consumo.dto';
import { UpdateLecturaConsumoDto } from './dto/update-lectura-consumo.dto';

@Controller('lectura-consumo')
export class LecturaConsumoController {
  constructor(private readonly lecturaConsumoService: LecturaConsumoService) {}

  @Post()
  create(@Body() createLecturaConsumoDto: CreateLecturaConsumoDto) {
    return this.lecturaConsumoService.create(createLecturaConsumoDto);
  }

  @Get()
  findAll() {
    return this.lecturaConsumoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lecturaConsumoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLecturaConsumoDto: UpdateLecturaConsumoDto) {
    return this.lecturaConsumoService.update(+id, updateLecturaConsumoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lecturaConsumoService.remove(+id);
  }
}
