import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { RolService } from './rol.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { Public } from 'src/autenticacion/decorators/Public';
import { Request } from 'express';
import { ValidateIdPipe } from 'src/core-app/util/validate-id/validate-id.pipe';
import { Types } from 'mongoose';
import { Permiso } from 'src/autenticacion/decorators/Permiso';
import { PermisosE } from 'src/core-app/enums/permisos';
import { PublicInterno } from 'src/autenticacion/decorators/PublicInterno';

@Controller('rol')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Post()
  @Permiso([PermisosE.CREAR_ROL])
  create(@Body() createRolDto: CreateRolDto) {
    return this.rolService.create(createRolDto);
  }

  @Get()
  @Permiso([PermisosE.LISTAR_ROL])
  listarRoles() {
    return this.rolService.listarRoles();
  }

  @Get('publicas')
  @PublicInterno()
  listarRolesPublicas() {
    return this.rolService.listarRoles();
  }

  @Get('user')
  @PublicInterno()
  listarRolUsuario(@Req() request: Request) {
    return this.rolService.listarRolUsuario(request.rol);
  }

  @Get(':id')
  @Permiso([PermisosE.LISTAR_ROL])
  findOne(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.rolService.findOne(id);
  }

  @Patch(':id')
  @Permiso([PermisosE.EDITAR_ROL])
  editarRol(
    @Param('id', ValidateIdPipe) id: Types.ObjectId,
    @Body() updateRolDto: UpdateRolDto,
  ) {
    return this.rolService.editarRol(id, updateRolDto);
  }

  @Delete(':id')
  @Permiso([PermisosE.ELIMINAR_ROL])
  softDelete(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.rolService.softDelete(id);
  }
}
