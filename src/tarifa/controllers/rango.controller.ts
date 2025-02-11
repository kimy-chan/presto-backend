import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TarifaService } from '../services/tarifa.service';
import { RangoService } from '../services/rango.service';
import { Types } from 'mongoose';
import { ValidateIdPipe } from 'src/core-app/util/validate-id/validate-id.pipe';

@Controller('rango')
export class RangoController {
  constructor(private readonly rangoService: RangoService) {}

@Get(':tarifa')
  rangosTarifa(@Param('tarifa', ValidateIdPipe) tarifa:Types.ObjectId) {
    return this.rangoService.rangosTarifa(tarifa);
  }


}
