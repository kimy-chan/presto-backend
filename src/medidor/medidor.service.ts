import {
  BadRequestException,
  ConflictException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMedidorDto } from './dto/create-medidor.dto';
import { UpdateMedidorDto } from './dto/update-medidor.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Medidor } from './schema/medidor.schema';
import { Model, Types } from 'mongoose';
import { FlagE } from 'src/core-app/enums/flag';
import { EstadoMedidorE } from './enums/estados';
import { LecturaService } from 'src/lectura/lectura.service';
import { DataMedidorI } from './interface/dataMedidor';
import { DataMedidorCliente } from './interface/dataMedidorCliente';
import { BuscadorMedidorClienteDto } from './dto/BuscadorMedidorCliente.dto';
import { BuscadorMedidorClienteI } from './interface/buscadorMedidorCliente';

@Injectable()
export class MedidorService {
  constructor(
    @InjectModel(Medidor.name) private readonly medidor: Model<Medidor>,
    @Inject(forwardRef(() => LecturaService))
    private readonly lecturaService: LecturaService,
  ) {}
  async create(createMedidorDto: CreateMedidorDto) {
    const medidor = await this.medidor.findOne({
      numeroMedidor: createMedidorDto.numeroMedidor,
      flag: FlagE.nuevo,
    });

    if (medidor && medidor.numeroMedidor) {
      throw new ConflictException('El numero de medidor ya existe');
    }
    const codigo = await this.generarCodigo();
    createMedidorDto.codigo = codigo;
    createMedidorDto.cliente = new Types.ObjectId(createMedidorDto.cliente);
    createMedidorDto.tarifa = new Types.ObjectId(createMedidorDto.tarifa);
    await this.medidor.create(createMedidorDto);
    return { status: HttpStatus.CREATED };
  }

  private filtradorMedidorCliente(
    buscadorMedidorClienteDto: BuscadorMedidorClienteDto,
  ) {
    const filter: BuscadorMedidorClienteI = {};
    buscadorMedidorClienteDto.ci
      ? (filter.ci = new RegExp(buscadorMedidorClienteDto.ci, 'i'))
      : filter;

    buscadorMedidorClienteDto.nombre
      ? (filter.nombre = new RegExp(buscadorMedidorClienteDto.nombre, 'i'))
      : filter;

    buscadorMedidorClienteDto.apellidoMaterno
      ? (filter.apellidoMaterno = new RegExp(
          buscadorMedidorClienteDto.apellidoMaterno,
          'i',
        ))
      : filter;

    buscadorMedidorClienteDto.apellidoPaterno
      ? (filter.apellidoPaterno = new RegExp(
          buscadorMedidorClienteDto.apellidoPaterno,
          'i',
        ))
      : filter;
    buscadorMedidorClienteDto.numeroMedidor
      ? (filter.numeroMedidor = buscadorMedidorClienteDto.numeroMedidor)
      : filter;
    return filter;
  }
  async listarMedidorCliente(
    buscadorMedidorClienteDto: BuscadorMedidorClienteDto,
  ) {
    const { numeroMedidor, apellidoMaterno, apellidoPaterno, ci, nombre } =
      this.filtradorMedidorCliente(buscadorMedidorClienteDto);

    const medidores = await this.medidor.aggregate([
      {
        $match: {
          flag: FlagE.nuevo,
          ...(numeroMedidor ? { numeroMedidor: numeroMedidor } : {}),
        },
      },
      {
        $lookup: {
          from: 'Cliente',
          foreignField: '_id',
          localField: 'cliente',
          as: 'cliente',
        },
      },

      {
        $unwind: { path: '$cliente', preserveNullAndEmptyArrays: false },
      },
      {
        $match: {
          'cliente.flag': FlagE.nuevo,
        },
      },

      ...(nombre
        ? [
            {
              $match: {
                'cliente.nombre': nombre,
              },
            },
          ]
        : []),

      ...(apellidoPaterno
        ? [
            {
              $match: {
                'cliente.apellidoPaterno': apellidoPaterno,
              },
            },
          ]
        : []),
      ...(apellidoMaterno
        ? [
            {
              $match: {
                'cliente.apellidoMaterno': apellidoMaterno,
              },
            },
          ]
        : []),
      ...(ci
        ? [
            {
              $match: {
                'cliente.ci': ci,
              },
            },
          ]
        : []),

      {
        $project: {
          codigoCliente: '$cliente.codigo',
          ci: '$cliente.ci',
          apellido: '$cliente.nombre',
          estado: 1,
          nombre: '$cliente.nombre',
          apellidoPaterno: '$cliente.apellidoPaterno',

          apellidoMaterno: '$cliente.apellidoMaterno',
          numeroMedidor: 1,
          direccion: 1,
          codigo: 1,
        },
      },
      {
        $sort: { fecha: -1 },
      },
      {
        $facet: {
          data: [
            {
              $limit: buscadorMedidorClienteDto.limite,
            },
            {
              $skip:
                (buscadorMedidorClienteDto.pagina - 1) *
                buscadorMedidorClienteDto.limite,
            },
          ],
          countDocuments: [
            {
              $count: 'total',
            },
          ],
        },
      },
    ]);

    const cantidadItems = medidores[0].countDocuments[0]
      ? medidores[0].countDocuments[0].total
      : 1;
    const paginas = Math.ceil(cantidadItems / buscadorMedidorClienteDto.limite);
    return { status: HttpStatus.OK, data: medidores[0].data, paginas: paginas };
  }

  async findOne(id: Types.ObjectId) {
    const medidor = await this.medidor.findOne({
      _id: new Types.ObjectId(id),
      flag: FlagE.nuevo,
    });
    return { status: HttpStatus.OK, data: medidor };
  }

  async editar(id: Types.ObjectId, updateMedidorDto: UpdateMedidorDto) {
    const medidor = await this.medidor.findOne({
      flag: FlagE.nuevo,
      numeroMedidor: updateMedidorDto.numeroMedidor,
      _id: { $ne: new Types.ObjectId(id) },
    });
    if (medidor && medidor.numeroMedidor) {
      throw new ConflictException('El numero de medidor ya existe');
    }
    updateMedidorDto.tarifa = new Types.ObjectId(updateMedidorDto.tarifa);
    await this.medidor.updateOne(
      { _id: new Types.ObjectId(id) },
      updateMedidorDto,
    );
    return { status: HttpStatus.OK };
  }

  async softDelete(id: Types.ObjectId) {
    try {
      const medidor = await this.medidor.findOne({
        _id: new Types.ObjectId(id),
        flag: FlagE.nuevo,
      });
      if (!medidor) {
        throw new NotFoundException('El medidor no existe');
      }
      await this.medidor.updateOne(
        {
          _id: new Types.ObjectId(id),
        },
        { flag: FlagE.eliminado },
      );

      return { status: HttpStatus.OK };
    } catch (error) {
      console.log(error);

      new BadRequestException();
    }
  }
  private async generarCodigo() {
    let countDocuments = await this.medidor.countDocuments({
      flag: FlagE.nuevo,
    });
    countDocuments += 1;
    return countDocuments;
  }

  async buscarMedidor(numeroMedidor: string) {
    const dataM: DataMedidorI[] = [];
    const dataMedidor: DataMedidorI[] = await this.medidor.aggregate([
      {
        $match: {
          numeroMedidor: numeroMedidor,
          flag: FlagE.nuevo,
        },
      },
      {
        $lookup: {
          from: 'Cliente',
          foreignField: '_id',
          localField: 'cliente',
          as: 'cliente',
        },
      },
      {
        $unwind: { path: '$cliente', preserveNullAndEmptyArrays: false },
      },
      {
        $project: {
          estado: 1,
          nombre: '$cliente.nombre',
          codigoCliente: '$cliente.codigo',
          apellidoPaterno: '$cliente.apellidoPaterno',
          ci: '$cliente.ci',
          apellidoMaterno: '$cliente.apellidoMaterno',
          numeroMedidor: 1,
          direccion: 1,
          codigo: 1,
        },
      },
    ]);

    if (dataMedidor.length > 0) {
      for (const data of dataMedidor) {
        const lectura = await this.lecturaService.buscarLecturaAnterior(
          data._id,
        );
        const nuevaDada: DataMedidorI = {
          apellidoMaterno: data.apellidoMaterno,
          direccion: data.direccion,
          apellidoPaterno: data.apellidoPaterno,
          ci: data.ci,
          _id: data._id,
          codigo: data.codigo,
          codigoCliente: data.codigoCliente,
          estado: data.estado,
          lecturaAnterior: lectura ? lectura.lecturaActual : 0,
          nombre: data.nombre,
          numeroMedidor: data.numeroMedidor,
        };
        dataM.push(nuevaDada);
      }
    }

    return dataM[0];
  }

  async buscarMedidorActivo(medidor: Types.ObjectId) {
    const data = await this.medidor.findOne({
      flag: FlagE.nuevo,
      estado: EstadoMedidorE.activo,
      _id: new Types.ObjectId(medidor),
    });
    return data;
  }

  async medidorCliente(cliente: Types.ObjectId) {
    const medidores = await this.medidor.aggregate([
      {
        $match: {
          flag: FlagE.nuevo,
          estado: EstadoMedidorE.activo,
          cliente: new Types.ObjectId(cliente),
        },
      },
      {
        $lookup: {
          from: 'Tarifa',
          foreignField: '_id',
          localField: 'tarifa',
          as: 'tarifa',
        },
      },
      {
        $unwind: { path: '$tarifa', preserveNullAndEmptyArrays: false },
      },
      {
        $project: {
          numeroMedidor: 1,
          tarifa: '$tarifa.nombre',
          estado: 1,
        },
      },
    ]);

    return medidores;
  }

  async medidorCienteData(medidor: Types.ObjectId) {
    const dataMedidorCliente: DataMedidorCliente[] =
      await this.medidor.aggregate([
        {
          $match: {
            flag: FlagE.nuevo,
            _id: new Types.ObjectId(medidor),
          },
        },
        {
          $lookup: {
            from: 'Cliente',
            foreignField: '_id',
            localField: 'cliente',
            as: 'cliente',
          },
        },
        {
          $unwind: { path: '$cliente', preserveNullAndEmptyArrays: false },
        },
        {
          $project: {
            numeroMedidor: 1,
            ci: '$cliente.ci',
            nombre: '$cliente.nombre',
            apellidoPaterno: '$cliente.apellidoPaterno',
            apellidoMaterno: '$cliente.apellidoMaterno',
            direccion: 1,
          },
        },
      ]);
    return dataMedidorCliente[0];
  }
}
