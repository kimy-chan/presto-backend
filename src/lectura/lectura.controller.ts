import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { LecturaService } from './lectura.service';
import { CreateLecturaDto } from './dto/create-lectura.dto';
import { UpdateLecturaDto } from './dto/update-lectura.dto';
import { ValidateIdPipe } from 'src/core-app/util/validate-id/validate-id.pipe';
import { Types } from 'mongoose';
import { query } from 'express';
import { BuscadorClienteDto } from 'src/cliente/dto/BuscadorCliente.dto';
import { BuscadorLecturaDto } from './dto/BuscadorLectura.dto';

@Controller('lectura')
export class LecturaController {
  constructor(private readonly lecturaService: LecturaService) {}

  @Post()
  create(@Body() createLecturaDto: CreateLecturaDto) {
    return this.lecturaService.create(createLecturaDto);
  }

  @Get()
  listarLecturas(@Query() buscadorLecturaDto: BuscadorLecturaDto) {
    return this.lecturaService.listarLecturas(buscadorLecturaDto);
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

  @Get('recibo/:id')
  reciboLectura(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.lecturaService.reciboLectura(id);
  }
  @Get('medidor/:medidor')
  lecturaMedidor(@Param('medidor', ValidateIdPipe) medidor: Types.ObjectId) {
    return this.lecturaService.lecturaMedidor(medidor);
  }
}
