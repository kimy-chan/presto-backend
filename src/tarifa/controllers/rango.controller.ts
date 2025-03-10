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
import { RangoService } from '../services/rango.service';
import { Types } from 'mongoose';
import { ValidateIdPipe } from 'src/core-app/util/validate-id/validate-id.pipe';
import { EditarRangoDto } from '../dto/EditarRango.dto';
import { PermisosE } from 'src/core-app/enums/permisos';
import { Permiso } from 'src/autenticacion/decorators/Permiso';

@Controller('rango')
export class RangoController {
  constructor(private readonly rangoService: RangoService) {}

  @Get(':tarifa')
  @Permiso([PermisosE.LISTAR_GASTO])
  rangosTarifa(@Param('tarifa', ValidateIdPipe) tarifa: Types.ObjectId) {
    return this.rangoService.rangosTarifa(tarifa);
  }

  @Get('id/:id')
  @Permiso([PermisosE.LISTAR_GASTO])
  rangoOne(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.rangoService.rangoOne(id);
  }
  @Patch(':id')
  @Permiso([PermisosE.EDITAR_GASTO])
  editarRango(
    @Param('id', ValidateIdPipe) id: Types.ObjectId,
    @Body() editarRangoDto: EditarRangoDto,
  ) {
    console.log(editarRangoDto);

    return this.rangoService.editarRango(id, editarRangoDto);
  }

  @Delete(':id')
  @Permiso([PermisosE.ELIMINAR_TARIFA])
  softDelete(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.rangoService.softDelete(id);
  }
}
