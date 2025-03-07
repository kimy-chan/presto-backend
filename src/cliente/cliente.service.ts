import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cliente } from './schema/cliente.schema';
import { Model, Types } from 'mongoose';
import { FlagE } from 'src/core-app/enums/flag';
import { BuscadorClienteDto } from './dto/BuscadorCliente.dto';
import { BuscadorClienteI } from './interface/BuscadorCliente';

@Injectable()
export class ClienteService {
  constructor(
    @InjectModel(Cliente.name) private readonly cliente: Model<Cliente>,
  ) {}
  async create(createClienteDto: CreateClienteDto) {
    const cliente = await this.cliente.findOne({
      ci: createClienteDto.ci,
      flag: FlagE.nuevo,
    });

    if (cliente && cliente.ci) {
      throw new ConflictException('El ci ya se encuentra registrado');
    }
    const codigo = await this.generarCodigo();
    const clienteRegistrado = await this.cliente.create({
      apellidoMaterno: createClienteDto.apellidoMaterno,
      apellidoPaterno: createClienteDto.apellidoPaterno,
      celular: createClienteDto.celular,
      codigo: codigo,
      //direccion:createClienteDto.direccion,
      ci: createClienteDto.ci,
      nombre: createClienteDto.nombre,
    });

    return { status: HttpStatus.CREATED, cliente: clienteRegistrado };
  }

  async listarClientes(buscadorClienteDto: BuscadorClienteDto) {
    const filter: BuscadorClienteI = {};
    buscadorClienteDto.codigo
      ? (filter.codigo = buscadorClienteDto.codigo)
      : filter;
    buscadorClienteDto.ci
      ? (filter.ci = new RegExp(buscadorClienteDto.ci, 'i'))
      : filter;
    buscadorClienteDto.nombre
      ? (filter.nombre = new RegExp(buscadorClienteDto.nombre, 'i'))
      : filter;
    buscadorClienteDto.apellidoPaterno
      ? (filter.apellidoPaterno = new RegExp(
          buscadorClienteDto.apellidoPaterno,
          'i',
        ))
      : filter;
    buscadorClienteDto.apellidoMaterno
      ? (filter.apellidoMaterno = new RegExp(
          buscadorClienteDto.apellidoMaterno,
          'i',
        ))
      : filter;
    const countDocuments = await this.cliente.countDocuments({
      flag: FlagE.nuevo,
    });
    const paginas = Math.ceil(countDocuments / buscadorClienteDto.limite);

    const clientes = await this.cliente
      .find({
        flag: FlagE.nuevo,
        ...filter,
      })
      .skip(
        (Number(buscadorClienteDto.pagina) - 1) *
          Number(buscadorClienteDto.limite),
      )
      .limit(buscadorClienteDto.limite)

      .sort({ codigo: -1 });
    console.log(clientes);

    return { status: HttpStatus.OK, paginas: paginas, data: clientes };
  }

  async findOne(id: Types.ObjectId) {
    const cliente = await this.cliente.findOne({ _id: new Types.ObjectId(id) });
    if (!cliente) {
      throw new NotFoundException('El cliente no existe');
    }

    return { status: HttpStatus.OK, data: cliente };
  }

  async editar(id: Types.ObjectId, updateClienteDto: UpdateClienteDto) {
    const cliente = await this.cliente.findOne({
      _id: { $ne: new Types.ObjectId(id) },
      ci: updateClienteDto.ci,
      flag: FlagE.nuevo,
    });
    if (cliente && cliente.ci) {
      throw new ConflictException('El ci ya se encuentra registrado');
    }
    await this.cliente.updateOne(
      { _id: new Types.ObjectId(id) },
      updateClienteDto,
    );
    return { status: HttpStatus.OK };
  }

  async softDelete(id: Types.ObjectId) {
    console.log(id);

    const cliente = await this.cliente.findOne({
      _id: new Types.ObjectId(id),
      flag: FlagE.nuevo,
    });

    if (!cliente) {
      throw new NotFoundException();
    }
    await this.cliente.updateOne(
      { _id: new Types.ObjectId(id) },
      { flag: FlagE.eliminado },
    );
    return { status: HttpStatus.OK };
  }

  private async generarCodigo() {
    let countDocuments = await this.cliente.countDocuments({
      flag: FlagE.nuevo,
    });
    countDocuments += 1;
    return countDocuments;
  }
}
