import {
  ConflictException,
  HttpCode,
  HttpStatus,
  Injectable,
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

  findOne(id: number) {
    return `This action returns a #${id} rol`;
  }

  update(id: number, updateRolDto: UpdateRolDto) {
    return `This action updates a #${id} rol`;
  }

  remove(id: number) {
    return `This action removes a #${id} rol`;
  }
}
