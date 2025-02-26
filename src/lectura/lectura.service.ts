import {
  BadRequestException,
  ConflictException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  Param,
} from '@nestjs/common';
import { CreateLecturaDto } from './dto/create-lectura.dto';
import { UpdateLecturaDto } from './dto/update-lectura.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Lectura } from './schemas/lectura.schema';
import { Aggregate, Model, Types } from 'mongoose';
import { FlagE } from 'src/core-app/enums/flag';
import { LecturaI } from './interface/lectura';
import { PagoService } from 'src/pago/pago.service';
import { MedidorService } from 'src/medidor/medidor.service';
import { DataLecturaI } from './interface/dataLectura';
import { RangoService } from 'src/tarifa/services/rango.service';
import { types } from 'util';
import { EstadoMedidorE } from 'src/medidor/enums/estados';
import { EstadoLecturaE } from './enums/estadoLectura';
import { EstadoE } from 'src/pago/enum/estadoE';
import { BuscadorClienteDto } from 'src/cliente/dto/BuscadorCliente.dto';
import { BuscadorLecturaDto } from './dto/BuscadorLectura.dto';
import { BuscadorLecturaI } from './interface/buscadorLectura';
@Injectable()
export class LecturaService {
  constructor(
    @InjectModel(Lectura.name) private readonly lectura: Model<Lectura>,

    @Inject(forwardRef(() => MedidorService))
    private readonly medidorService: MedidorService,
    private readonly rangoService: RangoService,
  ) {}

  private filterLectura(buscadorLecturaDto: BuscadorLecturaDto) {
    const filter: BuscadorLecturaI = {};
    buscadorLecturaDto.numeroMedidor
      ? (filter.numeroMedidor = buscadorLecturaDto.numeroMedidor)
      : filter;
    buscadorLecturaDto.mes ? (filter.mes = buscadorLecturaDto.mes) : filter;
    buscadorLecturaDto.fechaInicio && buscadorLecturaDto.fechaFin
      ? (filter.fecha = {
          $gte: new Date(buscadorLecturaDto.fechaInicio),
          $lte: new Date(buscadorLecturaDto.fechaFin),
        })
      : filter;

    return filter;
  }
  async create(createLecturaDto: CreateLecturaDto) {
    const date = new Date();
    const gestion = date.getFullYear();

    const lectura = await this.lectura.findOne({
      flag: FlagE.nuevo,
      medidor: new Types.ObjectId(createLecturaDto.medidor),
      mes: createLecturaDto.mes,
      gestion: gestion,
    });

    if (lectura) {
      throw new ConflictException('La lectura ya fue registrada');
    }
    const consumo =
      createLecturaDto.lecturaActual - createLecturaDto.lecturaAnterior;
    if (consumo < 0) {
      throw new BadRequestException('Ingrece las lecturas correctas');
    }
    const medidor = await this.medidorService.buscarMedidorActivo(
      createLecturaDto.medidor,
    );
    if (medidor) {
      const costoApagar = await this.calcularTarifa(consumo, medidor.tarifa);
      const dataLectura: LecturaI = {
        codigo: await this.codigoLectura(),

        numeroLectura: await this.numeroLectura(
          new Types.ObjectId(createLecturaDto.medidor),
        ),
        consumoTotal: consumo,
        lecturaActual: createLecturaDto.lecturaActual,
        lecturaAnterior: createLecturaDto.lecturaAnterior,
        medidor: new Types.ObjectId(createLecturaDto.medidor),
        mes: createLecturaDto.mes,
        costoApagar: costoApagar,
        gestion: String(gestion),
      };
      const lectura = await this.lectura.create(dataLectura);
      return { status: HttpStatus.CREATED, lectura: lectura._id };
    }
    throw new BadRequestException('Ocurrio un error');
  }

  async buscarLecturaAnterior(medidor: Types.ObjectId) {
    const lectuta = await this.lectura
      .findOne({ medidor: new Types.ObjectId(medidor), flag: FlagE.nuevo })
      .sort({ numeroLectura: -1 })
      .limit(1);
    return lectuta;
  }

  private async numeroLectura(medidor: Types.ObjectId) {
    let codigo = await this.lectura.countDocuments({
      medidor: new Types.ObjectId(medidor),
      flag: FlagE.nuevo,
    });
    codigo += 1;
    return codigo;
  }

  private async codigoLectura() {
    let codigo = await this.lectura.countDocuments({
      flag: FlagE.nuevo,
    });
    codigo += 1;
    return codigo;
  }

  async reciboLectura(id: Types.ObjectId) {
    const recibo = await this.lectura.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'Medidor',
          foreignField: '_id',
          localField: 'medidor',
          as: 'medidor',
        },
      },
      {
        $unwind: { path: '$medidor', preserveNullAndEmptyArrays: false },
      },
      {
        $lookup: {
          from: 'Tarifa',
          foreignField: '_id',
          localField: 'medidor.tarifa',
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
          localField: 'medidor.cliente',
          as: 'cliente',
        },
      },
      {
        $unwind: { path: '$cliente', preserveNullAndEmptyArrays: false },
      },

      {
        $project: {
          codigoCliente: '$cliente.codigo',
          numeroMedidor: '$medidor.numeroMedidor',
          nombre: '$cliente.nombre',
          apellidoPaterno: '$cliente.apellidoPaterno',
          apellidoMaterno: '$cliente.apellidoMaterno',
          direccion: '$medidor.direccion',
          categoria: '$tarifa.nombre',
          gestion: 1,
          fecha: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$fecha',
            },
          },
          lecturaActual: 1,
          lecturaAnterior: 1,
          consumoTotal: 1,
          costoApagar: 1,
        },
      },
    ]);
    return { status: HttpStatus.OK, data: recibo[0] };
  }
  async listarLecturas(buscadorLecturaDto: BuscadorLecturaDto) {
    const { numeroMedidor, ...filter } = this.filterLectura(buscadorLecturaDto);

    try {
      const lectura = await this.lectura.aggregate([
        {
          $match: {
            flag: FlagE.nuevo,
            ...filter,
          },
        },
        {
          $lookup: {
            from: 'Medidor',
            foreignField: '_id',
            localField: 'medidor',
            as: 'medidor',
          },
        },

        {
          $unwind: { path: '$medidor', preserveNullAndEmptyArrays: false },
        },

        ...(numeroMedidor
          ? [{ $match: { 'medidor.numeroMedidor': numeroMedidor } }]
          : []),

        {
          $lookup: {
            from: 'Cliente',
            foreignField: '_id',
            localField: 'medidor.cliente',
            as: 'cliente',
          },
        },

        {
          $unwind: { path: '$cliente', preserveNullAndEmptyArrays: false },
        },

        {
          $project: {
            _id: 1,
            ci: '$cliente.ci',
            nombre: '$cliente.nombre',
            apellidoPaterno: '$cliente.apellidoPaterno',
            apellidoMaterno: '$cliente.apellidoMaterno',
            numeroMedidor: '$medidor.numeroMedidor',
            estadoMedidor: '$medidor.estado',
            lecturaActual: 1,
            lecturaAnterior: 1,
            consumoTotal: 1,
            costoApagar: 1,
            gestion: 1,
            mes: 1,
            estado: 1,
            fecha: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$fecha',
              },
            },
          },
        },
        {
          $sort: { fecha: -1 },
        },
        {
          $facet: {
            data: [
              {
                $limit: buscadorLecturaDto.limite,
              },
              {
                $skip:
                  (buscadorLecturaDto.pagina - 1) * buscadorLecturaDto.limite,
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
      const cantidadItems = lectura[0].countDocuments[0]
        ? lectura[0].countDocuments[0].total
        : 1;
      const paginas = Math.ceil(cantidadItems / buscadorLecturaDto.limite);
      return { status: HttpStatus.OK, paginas: paginas, data: lectura[0].data };
    } catch (error) {
      console.log(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} lectura`;
  }

  update(id: number, updateLecturaDto: UpdateLecturaDto) {
    return `This action updates a #${id} lectura`;
  }

  remove(id: number) {
    return `This action removes a #${id} lectura`;
  }
  private async calcularTarifa(consumoTotal: number, tarifa: Types.ObjectId) {
    const rangos = await this.rangoService.tarifaRangoMedidor(tarifa);
    let consumo = consumoTotal; // lectura actual
    let costoTotal = 0;
    for (const rango of rangos) {
      let capacidadAgua = Math.min(consumo, rango.rango2 - rango.rango1);
      const costo = capacidadAgua * rango.costo;
      consumo -= capacidadAgua;
      costoTotal += costo;
    }
    return Number(costoTotal.toFixed(2));
  }

  async lecturaMedidor(medidor: Types.ObjectId) {
    const lecturas = await this.lectura.find({
      medidor: new Types.ObjectId(medidor),
      flag: FlagE.nuevo,
      estado: EstadoLecturaE.PENDIENTE,
    });
    return lecturas;
  }

  async lecturaFindOne(lectura: Types.ObjectId) {
    return this.lectura.findOne({
      _id: new Types.ObjectId(lectura),
      estado: EstadoLecturaE.PENDIENTE,
      flag: FlagE.nuevo,
    });
  }

  async cambiarEstadoLectura(lectura: Types.ObjectId) {
    return this.lectura.updateOne(
      {
        _id: new Types.ObjectId(lectura),
        estado: EstadoLecturaE.PENDIENTE,
        flag: FlagE.nuevo,
      },
      { estado: EstadoLecturaE.PAGADO },
    );
  }
}
