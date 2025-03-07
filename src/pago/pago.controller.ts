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
import { BuscarPagoClienteDto } from './dto/BuscarPagoCliente.dto';
import { Permiso } from 'src/autenticacion/decorators/Permiso';
import { PermisosE } from 'src/core-app/enums/permisos';
import { PublicInterno } from 'src/autenticacion/decorators/PublicInterno';

@Controller('pago')
export class PagoController {
  constructor(private readonly pagoService: PagoService) {}

  @Post('realizar')
  @Permiso([PermisosE.CREAR_PAGO])
  realizarPago(@Body() realizarPago: RealizarPago) {
    return this.pagoService.realizarPago(realizarPago);
  }

  @Get('cliente/:medidor')
  @PublicInterno()
  pagosCliente(@Param('medidor', ValidateIdPipe) medidor: Types.ObjectId) {
    return this.pagoService.pagosCliente(medidor);
  }

  @Get('listar')
  @Permiso([PermisosE.LISTAR_PAGO])
  listarPagos(@Query() buscadorClienteDto: BuscarPagoClienteDto) {
    return this.pagoService.listarPagos(buscadorClienteDto);
  }
}
