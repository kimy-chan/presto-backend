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
import { Permiso } from 'src/autenticacion/decorators/Permiso';
import { PermisosE } from 'src/core-app/enums/permisos';
import { PublicInterno } from 'src/autenticacion/decorators/PublicInterno';

@Controller('lectura')
export class LecturaController {
  constructor(private readonly lecturaService: LecturaService) {}

  @Post()
  @Permiso([PermisosE.CREAR_LECTURA])
  create(@Body() createLecturaDto: CreateLecturaDto, @Req() request: Request) {
    return this.lecturaService.create(createLecturaDto, request.user);
  }

  @Get()
  @Permiso([PermisosE.LISTAR_LECTURA])
  listarLecturas(@Query() buscadorLecturaDto: BuscadorLecturaDto) {
    return this.lecturaService.listarLecturas(buscadorLecturaDto);
  }

  @Get(':id')
  @Permiso([PermisosE.LISTAR_LECTURA])
  findOne(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.lecturaService.findOne(id);
  }

  @Patch(':id')
  @Permiso([PermisosE.EDITAR_LECTURA])
  editarLectura(
    @Param('id', ValidateIdPipe) id: Types.ObjectId,
    @Body() updateLecturaDto: UpdateLecturaDto,
  ) {
    return this.lecturaService.editarLectura(id, updateLecturaDto);
  }

  @Delete(':id')
  @Permiso([PermisosE.ELIMINAR_LECTURA])
  softDelete(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.lecturaService.softDelete(id);
  }

  @Get('recibo/:medidor/:lectura')
  @Permiso([PermisosE.LISTAR_LECTURA])
  reciboLectura(
    @Param('medidor', ValidateIdPipe) medidor: Types.ObjectId,
    @Param('lectura', ValidateIdPipe) lectura: Types.ObjectId,
  ) {
    return this.lecturaService.reciboLectura(medidor, lectura);
  }
  @Get('medidor/:medidor')
  @PublicInterno()
  lecturaMedidor(@Param('medidor', ValidateIdPipe) medidor: Types.ObjectId) {
    return this.lecturaService.lecturaMedidor(medidor);
  }
}
