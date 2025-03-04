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

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clienteService.create(createClienteDto);
  }

  @Get()
  listarClientes(@Query() buscadorClienteDto: BuscadorClienteDto) {
    return this.clienteService.listarClientes(buscadorClienteDto);
  }

  @Get(':id')
  findOne(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.clienteService.findOne(id);
  }

  @Patch(':id')
  editar(
    @Param('id', ValidateIdPipe) id: Types.ObjectId,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    return this.clienteService.editar(id, updateClienteDto);
  }

  @Delete(':id')
  softDelete(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.clienteService.softDelete(id);
  }

  @Get('buscar/:codigo')
  buscarClietePorCodigo(@Param('codig') codigo: string) {
    return this.clienteService.buscarClietePorCodigo(codigo);
  }
}
