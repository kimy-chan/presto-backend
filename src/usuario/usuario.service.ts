import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/createUsuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from './schema/usuario.schema';
import { Model, Types } from 'mongoose';
import * as argon2 from 'argon2';
import { FlagE } from 'src/core-app/enums/flag';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectModel(Usuario.name) private readonly usuario: Model<Usuario>,
  ) {}
  async create(createUsuarioDto: CreateUsuarioDto) {
    const usuario = await this.usuario.findOne({
      usuario: createUsuarioDto.usuario,
      flag: FlagE.nuevo,
    });
    if (usuario) {
      throw new ConflictException('El usuario ya existe');
    }
    createUsuarioDto.password = await argon2.hash(createUsuarioDto.password);
    createUsuarioDto.rol = new Types.ObjectId(createUsuarioDto.rol);
    await this.usuario.create(createUsuarioDto);
    return { status: HttpStatus.CREATED };
  }
  async listarUsuarios() {
    const usuarios = await this.usuario.aggregate([
      {
        $match: {
          flag: FlagE.nuevo,
        },
      },
      {
        $lookup: {
          from: 'Rol',
          foreignField: '_id',
          localField: 'rol',
          as: 'rol',
        },
      },
      {
        $unwind: { path: '$rol', preserveNullAndEmptyArrays: false },
      },
      {
        $project: {
          nombre: 1,
          apellidoPaterno: 1,
          apellidoMaterno: 1,
          usuario: 1,
          direccion: 1,
          rolNombre: '$rol.nombre',
          rol: 1,
        },
      },
    ]);
    return usuarios;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
