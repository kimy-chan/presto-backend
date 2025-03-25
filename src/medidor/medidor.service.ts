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
import { Model, PipelineStage, Types } from 'mongoose';
import { FlagE } from 'src/core-app/enums/flag';
import { EstadoMedidorE } from './enums/estados';
import { LecturaService } from 'src/lectura/lectura.service';
import { DataMedidorI } from './interface/dataMedidor';
import { DataMedidorCliente } from './interface/dataMedidorCliente';
import { BuscadorMedidorClienteDto } from './dto/BuscadorMedidorCliente.dto';
import { BuscadorMedidorClienteI } from './interface/buscadorMedidorCliente';
import { EstadoLecturaE } from 'src/lectura/enums/estadoLectura';
import { PaginadorDto } from 'src/core-app/dto/Paginador.dto';
import * as ExcelJS from 'exceljs';

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

    buscadorMedidorClienteDto.estado
      ? (filter.estado = buscadorMedidorClienteDto.estado)
      : filter;
    return filter;
  }
  async listarMedidorCliente(
    buscadorMedidorClienteDto: BuscadorMedidorClienteDto,
  ) {
    const {
      numeroMedidor,
      apellidoMaterno,
      apellidoPaterno,
      ci,
      nombre,
      estado,
    } = this.filtradorMedidorCliente(buscadorMedidorClienteDto);

    const medidores = await this.medidor.aggregate([
      {
        $match: {
          flag: FlagE.nuevo,
          ...(numeroMedidor ? { numeroMedidor: numeroMedidor } : {}),
          ...(estado ? { estado: estado } : {}),
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
        $sort: { codigo: -1 },
      },
      {
        $facet: {
          data: [
            {
              $skip:
                (buscadorMedidorClienteDto.pagina - 1) *
                buscadorMedidorClienteDto.limite,
            },
            {
              $limit: buscadorMedidorClienteDto.limite,
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
    console.log(cantidadItems);

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

  async buscarMedidorPorId(medidor: Types.ObjectId) {
    const data = await this.medidor.findOne({
      flag: FlagE.nuevo,
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

  async listarMedidorConTresLecturas(paginadorDto: PaginadorDto) {
    try {
      const medidores = await this.obtenerMedidoresConTresLecturas(
        paginadorDto,
        true,
      );

      const cantidadItems = medidores[0].countDocuments[0]
        ? medidores[0].countDocuments[0].total
        : 1;
      const paginas = Math.ceil(cantidadItems / paginadorDto.limite);
      return {
        status: HttpStatus.OK,
        data: medidores[0].data,
        paginas: paginas,
      };
    } catch (error) {
      throw error;
    }
  }

  async realizarCorteMedidor(id: Types.ObjectId) {
    try {
      const medidor = await this.medidor.findOne({
        _id: new Types.ObjectId(id),
        estado: EstadoMedidorE.activo,
        flag: FlagE.nuevo,
      });
      if (!medidor) {
        throw new NotFoundException();
      }
      await this.medidor.updateMany(
        { _id: new Types.ObjectId(id) },
        { estado: EstadoMedidorE.inactivo },
      );
      return { status: HttpStatus.OK };
    } catch (error) {
      throw error;
    }
  }

  async listarUnMedidorConSuTarifa(
    medidorId: Types.ObjectId,
  ): Promise<DataMedidorCliente> {
    const medidor = await this.medidor.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(medidorId),
          flag: FlagE.nuevo,
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
          nombre: '$cliente.nombre',
          ci: '$cliente.ci',
          codigoCliente: '$cliente.codigo',
          apellidoPaterno: '$cliente.apellidoPaterno',
          apellidoMaterno: '$cliente.apellidoMaterno',
          tarifaNombre: '$tarifa.nombre',
          numeroMedidor: 1,
          direccion: 1,
        },
      },
    ]);

    return medidor[0];
  }

  async descargarExcelMedidorConTresLecturas(paginadorDto: PaginadorDto) {
    const medidores = await this.obtenerMedidoresConTresLecturas(
      paginadorDto,
      false,
    );
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('hoja 1');
    worksheet.columns = [
      {
        header: 'codigo Medidor',
        key: 'codigoMedidor',
      },
      {
        header: 'numero medidor',
        key: 'numeroMedidor',
      },
      {
        header: 'estado',
        key: 'estado',
      },
      {
        header: 'direccion',
        key: 'direccion',
      },
      {
        header: 'lecturas pedientes de pago',
        key: 'lecturas',
      },
    ];
    for (const medidor of medidores) {
      worksheet.addRow({
        codigoMedidor: medidor.codigo,
        numeroMedidor: medidor.numeroMedidor,
        estado: medidor.estado,
        direccion: medidor.direccion,
        lecturas: medidor.lecturas.length,
      });
    }
    return workbook;
  }

  private async obtenerMedidoresConTresLecturas(
    paginadorDto: PaginadorDto,
    paginador: boolean,
  ) {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          flag: FlagE.nuevo,
          estado: EstadoMedidorE.activo,
        },
      },

      {
        $lookup: {
          from: 'Lectura',
          foreignField: 'medidor',
          localField: '_id',
          as: 'lectura',
        },
      },

      { $unwind: { path: '$lectura', preserveNullAndEmptyArrays: false } },

      {
        $match: {
          'lectura.estado': EstadoLecturaE.PENDIENTE,
        },
      },
      {
        $group: {
          _id: '$_id',
          numeroMedidor: { $first: '$numeroMedidor' },
          codigo: { $first: '$codigo' },
          estado: { $first: '$estado' },
          direccion: { $first: '$direccion' },
          lecturas: { $push: '$lectura' },
        },
      },
      {
        $match: {
          $expr: { $gte: [{ $size: '$lecturas' }, 3] },
        },
      },
      {
        $project: {
          numeroMedidor: 1,
          estado: 1,
          lecturas: 1,
          direccion: 1,
          codigo: 1,
        },
      },
    ];
    if (paginador) {
      pipeline.push({
        $facet: {
          data: [
            {
              $skip: (paginadorDto.pagina - 1) * paginadorDto.limite,
            },
            {
              $limit: paginadorDto.limite,
            },
          ],
          countDocuments: [
            {
              $count: 'total',
            },
          ],
        },
      });
    }
    return await this.medidor.aggregate(pipeline);
  }
}
