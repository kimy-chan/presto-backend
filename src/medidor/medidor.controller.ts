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
import { MedidorService } from './medidor.service';
import { CreateMedidorDto } from './dto/create-medidor.dto';
import { UpdateMedidorDto } from './dto/update-medidor.dto';
import { Types } from 'mongoose';
import { ValidateIdPipe } from 'src/core-app/util/validate-id/validate-id.pipe';
import { BuscadorMedidorClienteDto } from './dto/BuscadorMedidorCliente.dto';
import { Permiso } from 'src/autenticacion/decorators/Permiso';
import { PermisosE } from 'src/core-app/enums/permisos';
import { PublicInterno } from 'src/autenticacion/decorators/PublicInterno';

@Controller('medidor')
export class MedidorController {
  constructor(private readonly medidorService: MedidorService) {}

  @Post()
  @Permiso([PermisosE.CREAR_MEDIDOR])
  create(@Body() createMedidorDto: CreateMedidorDto) {
    return this.medidorService.create(createMedidorDto);
  }

  @Get()
  @Permiso([PermisosE.LISTAR_MEDIDOR])
  listarMedidorCliente(
    @Query() buscadorMedidorClienteDto: BuscadorMedidorClienteDto,
  ) {
    return this.medidorService.listarMedidorCliente(buscadorMedidorClienteDto);
  }

  @Get(':id')
  @Permiso([PermisosE.LISTAR_MEDIDOR])
  findOne(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.medidorService.findOne(id);
  }

  @Patch(':id')
  @Permiso([PermisosE.EDITAR_MEDIDOR])
  editar(
    @Param('id', ValidateIdPipe) id: Types.ObjectId,
    @Body() updateMedidorDto: UpdateMedidorDto,
  ) {
    return this.medidorService.editar(id, updateMedidorDto);
  }

  @Delete(':id')
  @Permiso([PermisosE.ELIMINAR_MEDIDOR])
  softDelete(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.medidorService.softDelete(id);
  }

  @Get('buscar/:numeroMedidor')
  @PublicInterno()
  buscarMedidor(@Param('numeroMedidor') numeroMedidor: string) {
    return this.medidorService.buscarMedidor(numeroMedidor);
  }

  @Get('cliente/:cliente')
  @PublicInterno()
  medidorCliente(@Param('cliente', ValidateIdPipe) cliente: Types.ObjectId) {
    return this.medidorService.medidorCliente(cliente);
  }
}
