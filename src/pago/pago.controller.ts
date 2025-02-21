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
import { PagoService } from './pago.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { BuscarPagoDto } from './dto/buscarPago.dto';
import { RealizarPago } from './dto/realizarPago.dto';
import { ValidateIdPipe } from 'src/core-app/util/validate-id/validate-id.pipe';
import { Types } from 'mongoose';

@Controller('pago')
export class PagoController {
  constructor(private readonly pagoService: PagoService) {}

  @Post('realizar')
  realizarPago(@Body() realizarPago: RealizarPago) {
    return this.pagoService.realizarPago(realizarPago);
  }

  @Get('cliente/:medidor')
  pagosCliente(@Param('medidor', ValidateIdPipe) medidor: Types.ObjectId) {
    return this.pagoService.pagosCliente(medidor);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePagoDto: UpdatePagoDto) {
    return this.pagoService.update(+id, updatePagoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagoService.remove(+id);
  }
}
