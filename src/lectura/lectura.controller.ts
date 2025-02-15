import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LecturaService } from './lectura.service';
import { CreateLecturaDto } from './dto/create-lectura.dto';
import { UpdateLecturaDto } from './dto/update-lectura.dto';

@Controller('lectura')
export class LecturaController {
  constructor(private readonly lecturaService: LecturaService) {}

  @Post()
  create(@Body() createLecturaDto: CreateLecturaDto) {
    return this.lecturaService.create(createLecturaDto);
  }

  @Get()
  findAll() {
    return this.lecturaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lecturaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLecturaDto: UpdateLecturaDto) {
    return this.lecturaService.update(+id, updateLecturaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lecturaService.remove(+id);
  }
}
