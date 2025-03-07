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
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { BuscadorClienteDto } from './dto/BuscadorCliente.dto';
import { ValidateIdPipe } from 'src/core-app/util/validate-id/validate-id.pipe';
import { Types } from 'mongoose';
import { Permiso } from 'src/autenticacion/decorators/Permiso';
import { PermisosE } from 'src/core-app/enums/permisos';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  @Permiso([PermisosE.CREAR_CLIENTE])
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clienteService.create(createClienteDto);
  }

  @Get()
  @Permiso([PermisosE.LISTAR_CLIENTE])
  listarClientes(@Query() buscadorClienteDto: BuscadorClienteDto) {
    return this.clienteService.listarClientes(buscadorClienteDto);
  }

  @Get(':id')
  @Permiso([PermisosE.LISTAR_CLIENTE])
  findOne(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.clienteService.findOne(id);
  }

  @Patch(':id')
  @Permiso([PermisosE.EDITAR_CLIENTE])
  editar(
    @Param('id', ValidateIdPipe) id: Types.ObjectId,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    return this.clienteService.editar(id, updateClienteDto);
  }

  @Delete(':id')
  @Permiso([PermisosE.ELIMINAR_CLIENTE])
  softDelete(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.clienteService.softDelete(id);
  }
}
