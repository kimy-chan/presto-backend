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
  private configuracionArgon: argon2.Options = {
    type: argon2.argon2i,
    timeCost: 3,
    parallelism: 1,
  };
  constructor(
    @InjectModel(Usuario.name) private readonly usuario: Model<Usuario>,
  ) {}
  async create(createUsuarioDto: CreateUsuarioDto) {
    const ci = await this.usuario.findOne({
      usuario: createUsuarioDto.ci,
      flag: FlagE.nuevo,
    });
    const usuario = await this.usuario.findOne({
      usuario: createUsuarioDto.usuario,
      flag: FlagE.nuevo,
    });
    if (ci) {
      throw new ConflictException({
        propiedad: 'ci',
        message: 'El ci ya existe',
      });
    }
    if (usuario) {
      throw new ConflictException({
        propiedad: 'usuario',
        message: 'El usuario ya existe',
      });
    }
    createUsuarioDto.password = await argon2.hash(createUsuarioDto.password, {
      ...this.configuracionArgon,
    });
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
          ci: 1,
          nombre: 1,
          apellidoPaterno: 1,
          apellidoMaterno: 1,
          usuario: 1,
          direccion: 1,
          celular: 1,
          rolNombre: '$rol.nombre',
          rol: 1,
        },
      },
    ]);
    return usuarios;
  }

  async verificarUsuario(usuario: string) {
    const user = await this.usuario.findOne({
      usuario: usuario,
      flag: FlagE.nuevo,
    });
    return user;
  }

  async verificarUsuarioId(id: Types.ObjectId) {
    const user = await this.usuario.findOne({
      _id: new Types.ObjectId(id),
      flag: FlagE.nuevo,
    });
    return user;
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
