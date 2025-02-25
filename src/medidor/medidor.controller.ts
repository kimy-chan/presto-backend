import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MedidorService } from './medidor.service';
import { CreateMedidorDto } from './dto/create-medidor.dto';
import { UpdateMedidorDto } from './dto/update-medidor.dto';
import { Types } from 'mongoose';
import { ValidateIdPipe } from 'src/core-app/util/validate-id/validate-id.pipe';

@Controller('medidor')
export class MedidorController {
  constructor(private readonly medidorService: MedidorService) {}

  @Post()
  create(@Body() createMedidorDto: CreateMedidorDto) {
    return this.medidorService.create(createMedidorDto);
  }

  @Get()
  findAll() {
    return this.medidorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medidorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedidorDto: UpdateMedidorDto) {
    return this.medidorService.update(+id, updateMedidorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medidorService.remove(+id);
  }

  @Get('buscar/:numeroMedidor')
  buscarMedidor(@Param('numeroMedidor') numeroMedidor: string) {
    return this.medidorService.buscarMedidor(numeroMedidor);
  }

  @Get('cliente/:cliente')
  medidorCliente(@Param('cliente', ValidateIdPipe) cliente: Types.ObjectId) {
    return this.medidorService.medidorCliente(cliente);
  }
}
