import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriaGastoService } from './categoria-gasto.service';
import { CreateCategoriaGastoDto } from './dto/create-categoria-gasto.dto';
import { UpdateCategoriaGastoDto } from './dto/update-categoria-gasto.dto';
import { Permiso } from 'src/autenticacion/decorators/Permiso';
import { PermisosE } from 'src/core-app/enums/permisos';

@Controller('categoria/gasto')
export class CategoriaGastoController {
  constructor(private readonly categoriaGastoService: CategoriaGastoService) {}

  @Post()
  @Permiso([PermisosE.CREAR_GASTO])
  create(@Body() createCategoriaGastoDto: CreateCategoriaGastoDto) {
    return this.categoriaGastoService.create(createCategoriaGastoDto);
  }

  @Get()
  @Permiso([PermisosE.LISTAR_GASTO])
  findAll() {
    return this.categoriaGastoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriaGastoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoriaGastoDto: UpdateCategoriaGastoDto,
  ) {
    return this.categoriaGastoService.update(+id, updateCategoriaGastoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriaGastoService.remove(+id);
  }
}
