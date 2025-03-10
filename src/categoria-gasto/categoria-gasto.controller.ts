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
import { CategoriaGastoService } from './categoria-gasto.service';
import { CreateCategoriaGastoDto } from './dto/create-categoria-gasto.dto';
import { UpdateCategoriaGastoDto } from './dto/update-categoria-gasto.dto';
import { Permiso } from 'src/autenticacion/decorators/Permiso';
import { PermisosE } from 'src/core-app/enums/permisos';
import { PublicInterno } from 'src/autenticacion/decorators/PublicInterno';
import { ValidateIdPipe } from 'src/core-app/util/validate-id/validate-id.pipe';
import { Types } from 'mongoose';
import { PaginadorDto } from 'src/core-app/dto/Paginador.dto';

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
  findAll(@Query() paginadorDto: PaginadorDto) {
    return this.categoriaGastoService.findAll(paginadorDto);
  }

  @Get('publico')
  @PublicInterno()
  categoriaPublico() {
    return this.categoriaGastoService.listarCategoriaGasto();
  }

  @Get(':id')
  @Permiso([PermisosE.LISTAR_GASTO])
  findOne(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.categoriaGastoService.findOne(id);
  }

  @Patch(':id')
  @Permiso([PermisosE.EDITAR_GASTO])
  update(
    @Param('id', ValidateIdPipe) id: Types.ObjectId,
    @Body() updateCategoriaGastoDto: UpdateCategoriaGastoDto,
  ) {
    return this.categoriaGastoService.editarCategoria(
      id,
      updateCategoriaGastoDto,
    );
  }

  @Delete(':id')
  @Permiso([PermisosE.ELIMINAR_GASTO])
  softDelete(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.categoriaGastoService.softDelete(id);
  }
}
