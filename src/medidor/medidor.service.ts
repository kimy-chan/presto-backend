import {
  ConflictException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
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

  async findAll() {
    const medidores = await this.medidor.aggregate([
      {
        $match: {
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
    ]);

    return medidores;
  }

  findOne(id: number) {
    return `This action returns a #${id} medidor`;
  }

  update(id: number, updateMedidorDto: UpdateMedidorDto) {
    return `This action updates a #${id} medidor`;
  }

  remove(id: number) {
    return `This action removes a #${id} medidor`;
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
          numeroMedidor: new RegExp(numeroMedidor, 'i'),
          estado: EstadoMedidorE.activo,
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
}
