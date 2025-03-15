import {
  ConflictException,
  HttpCode,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { Rol } from './schema/rol.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FlagE } from 'src/core-app/enums/flag';

@Injectable()
export class RolService {
  constructor(@InjectModel(Rol.name) private readonly rol: Model<Rol>) {}
  async create(createRolDto: CreateRolDto) {
    const rol = await this.rol.findOne({
      nombre: createRolDto.nombre,
      flag: FlagE.nuevo,
    });
    if (rol) {
      throw new ConflictException('El rol ya existe');
    }
    await this.rol.create(createRolDto);
    return { status: HttpStatus.CREATED };
  }

  async listarRoles() {
    const roles = await this.rol.find({ flag: FlagE.nuevo });
    return roles;
  }

  async listarRolUsuario(rolUser: Types.ObjectId) {
    const rol = await this.rol.findOne({
      _id: new Types.ObjectId(rolUser),
      flag: FlagE.nuevo,
    });

    return rol;
  }

  async findOne(id: Types.ObjectId) {
    const rol = await this.rol.findOne({
      _id: new Types.ObjectId(id),
      flag: FlagE.nuevo,
    });
    if (!rol) {
      throw new NotFoundException('El rol no existe');
    }

    return { status: HttpStatus.OK, data: rol };
  }

  async veririficarRol(id: Types.ObjectId) {
    const rol = await this.rol.findOne({
      _id: new Types.ObjectId(id),
      flag: FlagE.nuevo,
    });

    return rol;
  }

  async editarRol(id: Types.ObjectId, updateRolDto: UpdateRolDto) {
    const rol = await this.rol.findOne({
      _id: new Types.ObjectId(id),
      flag: FlagE.nuevo,
    });

    if (!rol) {
      throw new NotFoundException('El rol no existe');
    }

    const rolExiste = await this.rol.findOne({
      _id: { $ne: new Types.ObjectId(id) },
      nombre: updateRolDto.nombre,
      flag: FlagE.nuevo,
    });
    if (rolExiste) {
      throw new ConflictException('El rol ya existe');
    }
    await this.rol.updateOne({ _id: new Types.ObjectId(id) }, updateRolDto);
    return { status: HttpStatus.OK };
  }

  async softDelete(id: Types.ObjectId) {
    const rol = await this.rol.findOne({
      _id: new Types.ObjectId(id),
      flag: FlagE.nuevo,
    });
    if (!rol) {
      throw new NotFoundException('El rol no existe');
    }
    await this.rol.updateOne(
      { _id: new Types.ObjectId(id) },
      { flag: FlagE.eliminado },
    );
    return { status: HttpStatus.OK };
  }
}
