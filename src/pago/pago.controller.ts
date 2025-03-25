import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { PagoService } from './pago.service';
import { RealizarPago } from './dto/realizarPago.dto';
import { ValidateIdPipe } from 'src/core-app/util/validate-id/validate-id.pipe';
import { Types } from 'mongoose';
import { BuscarPagoClienteDto } from './dto/BuscarPagoCliente.dto';
import { Permiso } from 'src/autenticacion/decorators/Permiso';
import { PermisosE } from 'src/core-app/enums/permisos';
import { Request, Response, response } from 'express';
import { PublicInterno } from 'src/autenticacion/decorators/PublicInterno';

@Controller('pago')
export class PagoController {
  constructor(private readonly pagoService: PagoService) {}

  @Post('realizar')
  @Permiso([PermisosE.CREAR_PAGO])
  realizarPago(@Body() realizarPago: RealizarPago, @Req() request: Request) {
    return this.pagoService.realizarPago(realizarPago, request.user);
  }

  @Get('cliente/:medidor')
  @Permiso([PermisosE.LISTAR_PAGO])
  pagosCliente(@Param('medidor', ValidateIdPipe) medidor: Types.ObjectId) {
    return this.pagoService.pagosCliente(medidor);
  }

  @Permiso([PermisosE.LISTAR_PAGO])
  @Get('listar')
  listarPagos(@Query() buscadorClienteDto: BuscarPagoClienteDto) {
    return this.pagoService.listarPagos(buscadorClienteDto);
  }

  @PublicInterno()
  @Get('descargar/excel')
  async descargarExcelPago(
    @Query() buscadorClienteDto: BuscarPagoClienteDto,
    @Res() response: Response,
  ) {
    const workbook =
      await this.pagoService.descargarExcelPago(buscadorClienteDto);
      response.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    response.setHeader(
      'Content-Disposition',
      'attachment; filename="export.xlsx"',
    );
    await workbook.xlsx.write(response);
    return response.end();
  }
}
