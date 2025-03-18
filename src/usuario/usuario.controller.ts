import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/createUsuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ValidateIdPipe } from 'src/core-app/util/validate-id/validate-id.pipe';
import { Types } from 'mongoose';
import { Permiso } from 'src/autenticacion/decorators/Permiso';
import { PermisosE } from 'src/core-app/enums/permisos';
import { BuscadorUsuarioDto } from './dto/BuscadorUsuario.dto';
import { PublicInterno } from 'src/autenticacion/decorators/PublicInterno';
import { Request } from 'express';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @Permiso([PermisosE.CREAR_USUARIO])
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  @Permiso([PermisosE.LISTAR_USUARIO])
  findAll(@Query() BuscadorUsuarioDto: BuscadorUsuarioDto) {
    return this.usuarioService.listarUsuarios(BuscadorUsuarioDto);
  }

  @Get(':id')
  @Permiso([PermisosE.LISTAR_USUARIO])
  findOne(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.usuarioService.findOne(id);
  }

  @Patch(':id')
  @Permiso([PermisosE.EDITAR_USUARIO])
  editarUsuario(
    @Param('id', ValidateIdPipe) id: Types.ObjectId,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuarioService.editarUsuario(id, updateUsuarioDto);
  }

  @Delete(':id')
  @Permiso([PermisosE.EDITAR_MEDIDOR])
  softDelete(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.usuarioService.softDelete(id);
  }
  @Get('perfil/cuenta')
  @PublicInterno()
  perfilUsuario(@Req() request: Request) {
    return this.usuarioService.perfilUsuario(request.user);
  }
}
