import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/createUsuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from './schema/usuario.schema';
import { Model, Types } from 'mongoose';
import * as argon2 from 'argon2';
import { FlagE } from 'src/core-app/enums/flag';
import { Type } from 'class-transformer';
import { BuscadorUsuarioDto } from './dto/BuscadorUsuario.dto';
import { BuscadorUsuarioI } from './interface/buscadorUsuario';

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

  private buscadorUsuario(buscadorUsuarioDto: BuscadorUsuarioDto) {
    const filter: BuscadorUsuarioI = {};
    buscadorUsuarioDto.apellidoMaterno
      ? (filter.apellidoMaterno = new RegExp(
          buscadorUsuarioDto.apellidoMaterno,
          'i',
        ))
      : filter;
    buscadorUsuarioDto.apellidoPaterno
      ? (filter.apellidoPaterno = new RegExp(
          buscadorUsuarioDto.apellidoPaterno,
          'i',
        ))
      : filter;
    buscadorUsuarioDto.ci
      ? (filter.ci = new RegExp(buscadorUsuarioDto.ci, 'i'))
      : filter;
    buscadorUsuarioDto.rol
      ? (filter.rol = new Types.ObjectId(buscadorUsuarioDto.rol))
      : filter;
    buscadorUsuarioDto.nombre
      ? (filter.nombre = new RegExp(buscadorUsuarioDto.nombre, 'i'))
      : filter;
    return filter;
  }

  async listarUsuarios(buscadorUsuarioDto: BuscadorUsuarioDto) {
    const filter = this.buscadorUsuario(buscadorUsuarioDto);
    const countDocuments = await this.usuario.countDocuments({
      flag: FlagE.nuevo,
      ...filter,
    });
    console.log(buscadorUsuarioDto);

    const paginas = Math.ceil(countDocuments / buscadorUsuarioDto.limite);
    const usuarios = await this.usuario.aggregate([
      {
        $match: {
          flag: FlagE.nuevo,
          ...filter,
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
      {
        $limit: buscadorUsuarioDto.limite,
      },
      {
        $skip: (buscadorUsuarioDto.pagina - 1) * buscadorUsuarioDto.limite,
      },
    ]);
    return { status: HttpStatus.OK, data: usuarios, paginas: paginas };
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

  async findOne(id: Types.ObjectId) {
    const usuario = await this.usuario.findOne({
      _id: new Types.ObjectId(id),
      flag: FlagE.nuevo,
    });
    return { status: HttpStatus.OK, data: usuario };
  }

  async editarUsuario(id: Types.ObjectId, updateUsuarioDto: UpdateUsuarioDto) {
    try {
      const ci = await this.usuario.findOne({
        ci: updateUsuarioDto.ci,
        flag: FlagE.nuevo,
        _id: { $ne: new Types.ObjectId(id) },
      });

      if (ci && ci.ci) {
        throw new ConflictException({
          propiedad: 'ci',
          message: 'El ci ya encuentra registrado',
        });
      }
      const usuario = await this.usuario.findOne({
        usuario: updateUsuarioDto.usuario,
        flag: FlagE.nuevo,
        _id: { $ne: new Types.ObjectId(id) },
      });
      if (usuario && usuario.usuario) {
        throw new ConflictException({
          propiedad: 'usuario',
          message: 'El usuario ya se encutra registrado',
        });
      }
      updateUsuarioDto.rol = new Types.ObjectId(updateUsuarioDto.rol);
      await this.usuario.updateOne(
        { _id: new Types.ObjectId(id), flag: FlagE.nuevo },
        updateUsuarioDto,
      );
      return { status: HttpStatus.OK };
    } catch (error) {
      throw error;
    }
  }

  async softDelete(id: Types.ObjectId) {
    const usuario = await this.usuario.findOne({
      _id: new Types.ObjectId(id),
      flag: FlagE.nuevo,
    });
    if (!usuario) {
      throw new NotFoundException();
    }
    await this.usuario.updateOne(
      { _id: new Types.ObjectId(id), flag: FlagE.nuevo },
      { flag: FlagE.eliminado },
    );
    return { status: HttpStatus.OK };
  }

  async perfilUsuario(id: Types.ObjectId) {
    const usuario = await this.usuario.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id),
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
    return { status: HttpStatus.OK, data: usuario[0] };
  }
}
