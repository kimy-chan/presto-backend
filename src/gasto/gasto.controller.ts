import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GastoService } from './gasto.service';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { Permiso } from 'src/autenticacion/decorators/Permiso';
import { PermisosE } from 'src/core-app/enums/permisos';

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
  findAll() {
    return this.gastoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gastoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGastoDto: UpdateGastoDto) {
    return this.gastoService.update(+id, updateGastoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gastoService.remove(+id);
  }
}
