import { Controller, Post, Body } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { AutenticacionDto } from './dto/autenticacion.dto';
import { Public } from './decorators/Public';
@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}

  @Post()
  @Public()
  autenticacion(@Body() autenticacionDto: AutenticacionDto) {
    return this.autenticacionService.autenticacion(autenticacionDto);
  }
}
