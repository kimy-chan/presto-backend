import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { LecturaService } from './lectura.service';
import { CreateLecturaDto } from './dto/create-lectura.dto';
import { UpdateLecturaDto } from './dto/update-lectura.dto';
import { ValidateIdPipe } from 'src/core-app/util/validate-id/validate-id.pipe';
import { Types } from 'mongoose';
import { query, Request } from 'express';
import { BuscadorClienteDto } from 'src/cliente/dto/BuscadorCliente.dto';
import { BuscadorLecturaDto } from './dto/BuscadorLectura.dto';
import { request } from 'http';

@Controller('lectura')
export class LecturaController {
  constructor(private readonly lecturaService: LecturaService) {}

  @Post()
  create(@Body() createLecturaDto: CreateLecturaDto, @Req() request: Request) {
    return this.lecturaService.create(createLecturaDto, request.user);
  }

  @Get()
  listarLecturas(@Query() buscadorLecturaDto: BuscadorLecturaDto) {
    return this.lecturaService.listarLecturas(buscadorLecturaDto);
  }

  @Get(':id')
  findOne(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.lecturaService.findOne(id);
  }

  @Patch(':id')
  editarLectura(
    @Param('id', ValidateIdPipe) id: Types.ObjectId,
    @Body() updateLecturaDto: UpdateLecturaDto,
  ) {
    return this.lecturaService.editarLectura(id, updateLecturaDto);
  }

  @Delete(':id')
  softDelete(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.lecturaService.softDelete(id);
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
