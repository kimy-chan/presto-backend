import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TarifaService } from '../services/tarifa.service';
import { CreateTarifaDto } from '../dto/create-tarifa.dto';
import { UpdateTarifaDto } from '../dto/update-tarifa.dto';
import { ValidateIdPipe } from 'src/core-app/util/validate-id/validate-id.pipe';
import { Types } from 'mongoose';
import { Permiso } from 'src/autenticacion/decorators/Permiso';
import { PermisosE } from 'src/core-app/enums/permisos';

@Controller('tarifa')
export class TarifaController {
  constructor(private readonly tarifaService: TarifaService) {}

  @Post()
  @Permiso([PermisosE.CREAR_TARIFA])
  create(@Body() createTarifaDto: CreateTarifaDto) {
    return this.tarifaService.create(createTarifaDto);
  }

  @Get()
  @Permiso([PermisosE.LISTAR_TARIFA])
  findAll() {
    return this.tarifaService.findAll();
  }

  @Get(':id')
  @Permiso([PermisosE.LISTAR_TARIFA])
  findOne(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.tarifaService.findOne(id);
  }

  @Patch(':id')
  @Permiso([PermisosE.EDITAR_GASTO])
  editarTarifa(
    @Param('id', ValidateIdPipe) id: Types.ObjectId,
    @Body() updateTarifaDto: UpdateTarifaDto,
  ) {
    return this.tarifaService.editarTarifa(id, updateTarifaDto);
  }

  @Delete(':id')
  @Permiso([PermisosE.ELIMINAR_TARIFA])
  softDelete(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.tarifaService.softDelete(id);
  }
}
