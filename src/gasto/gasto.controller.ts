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
import { GastoService } from './gasto.service';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { Permiso } from 'src/autenticacion/decorators/Permiso';
import { PermisosE } from 'src/core-app/enums/permisos';
import { BuscadorGasto } from './dto/BuscarGasto.dto';
import { ValidateIdPipe } from 'src/core-app/util/validate-id/validate-id.pipe';
import { Types } from 'mongoose';

@Controller('gasto')
export class GastoController {
  constructor(private readonly gastoService: GastoService) {}

  @Post()
  @Permiso([PermisosE.CREAR_GASTO])
  create(@Body() createGastoDto: CreateGastoDto) {
    return this.gastoService.create(createGastoDto);
  }

  @Get()
  @Permiso([PermisosE.LISTAR_GASTO])
  listarGasto(@Query() buscadorGasto: BuscadorGasto) {
    return this.gastoService.listarGasto(buscadorGasto);
  }

  @Get(':id')
  @Permiso([PermisosE.LISTAR_GASTO])
  findOne(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.gastoService.findOne(id);
  }

  @Patch(':id')
  @Permiso([PermisosE.EDITAR_GASTO])
  editarGasto(
    @Param('id', ValidateIdPipe) id: Types.ObjectId,
    @Body() updateGastoDto: UpdateGastoDto,
  ) {
    return this.gastoService.editarGasto(id, updateGastoDto);
  }

  @Delete(':id')
  @Permiso([PermisosE.ELIMINAR_GASTO])
  softDelete(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.gastoService.softDelete(id);
  }
}
