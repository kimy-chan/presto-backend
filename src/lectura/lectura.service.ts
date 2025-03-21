import {
  BadRequestException,
  ConflictException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLecturaDto } from './dto/create-lectura.dto';
import { UpdateLecturaDto } from './dto/update-lectura.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Lectura } from './schemas/lectura.schema';
import { Aggregate, Model, Types } from 'mongoose';
import { FlagE } from 'src/core-app/enums/flag';
import { EditarLecturaI, LecturaI } from './interface/lectura';
import { PagoService } from 'src/pago/pago.service';
import { MedidorService } from 'src/medidor/medidor.service';
import { DataLecturaI } from './interface/dataLectura';
import { RangoService } from 'src/tarifa/services/rango.service';
import { types } from 'util';
import { EstadoMedidorE } from 'src/medidor/enums/estados';
import { EstadoLecturaE } from './enums/estadoLectura';
import { BuscadorClienteDto } from 'src/cliente/dto/BuscadorCliente.dto';
import { BuscadorLecturaDto } from './dto/BuscadorLectura.dto';
import { BuscadorLecturaI } from './interface/buscadorLectura';
import { UpdateRolDto } from 'src/rol/dto/update-rol.dto';
import { EstadoPagoE } from 'src/pago/enum/estadoE';
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
    buscadorLecturaDto.estado
      ? (filter.estado = buscadorLecturaDto.estado)
      : filter;
    buscadorLecturaDto.fechaInicio && buscadorLecturaDto.fechaFin
      ? (filter.fecha = {
          $gte: new Date(
            new Date(buscadorLecturaDto.fechaInicio).setUTCHours(0, 0, 0, 0),
          ),
          $lte: new Date(
            new Date(buscadorLecturaDto.fechaFin).setUTCHours(23, 59, 59, 999),
          ),
        })
      : filter;

    return filter;
  }
  async create(createLecturaDto: CreateLecturaDto, usuario: Types.ObjectId) {
    try {
      const date = new Date();
      const gestion = date.getFullYear();
      date.setMonth(date.getMonth() + 3);

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
      const medidor = await this.medidorService.buscarMedidorPorId(
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
          usuario: new Types.ObjectId(usuario),
          mes: createLecturaDto.mes,
          costoApagar: costoApagar,
          gestion: String(gestion),
          fechaVencimiento: date,
        };
        const lectura = await this.lectura.create(dataLectura);
        return {
          status: HttpStatus.CREATED,
          lectura: lectura._id,
          medidor: lectura.medidor,
        };
      }
    } catch (error) {
      console.log(error);

      throw error;
    }
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

  async reciboLectura(medidor: Types.ObjectId, lectura: Types.ObjectId) {
    const [medidorCliente, lect] = await Promise.all([
      this.medidorService.listarUnMedidorConSuTarifa(medidor),
      this.lectura
        .findOne({
          _id: new Types.ObjectId(lectura),
          flag: FlagE.nuevo,
        })
        .lean(),
    ]);
    if (medidorCliente && lect) {
      const lecturas = await this.lectura
        .find({
          medidor: new Types.ObjectId(medidorCliente._id),
          numeroLectura: { $lte: lect.numeroLectura },
          flag: FlagE.nuevo,
        })
        .sort({ numeroLectura: -1 })
        .limit(4);
      lecturas.reverse();
      return {
        status: HttpStatus.OK,
        data: {
          dataCliente: medidorCliente,
          lecturas: lecturas,
          lectura: lect,
        },
      };
    }
    throw new NotFoundException();
  }
  async listarLecturas(buscadorLecturaDto: BuscadorLecturaDto) {
    const { numeroMedidor, ...filter } = this.filterLectura(buscadorLecturaDto);
    console.log(buscadorLecturaDto);

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
        {
          $match: {
            'medidor.flag': FlagE.nuevo,
          },
        },
        ...(numeroMedidor
          ? [{ $match: { 'medidor.numeroMedidor': numeroMedidor } }]
          : []),

        {
          $project: {
            _id: 1,

            numeroMedidor: '$medidor.numeroMedidor',
            medidor: '$medidor._id',
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
            fechaVencimiento: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$fechaVencimiento',
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
                $skip:
                  (buscadorLecturaDto.pagina - 1) * buscadorLecturaDto.limite,
              },
              {
                $limit: buscadorLecturaDto.limite,
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

  async findOne(id: Types.ObjectId) {
    const lectura = await this.lectura.findOne({
      _id: new Types.ObjectId(id),
      flag: FlagE.nuevo,
    });
    if (!lectura) {
      throw new NotFoundException('Lectura no encontrada');
    }
    return { status: HttpStatus.OK, data: lectura };
  }

  /* private async calcularTarifa(consumoTotal: number, tarifa: Types.ObjectId) {
    const rangos = await this.rangoService.tarifaRangoMedidor(tarifa);
    rangos.sort((a, b) => a.rango1 - b.rango2);
    let consumo = consumoTotal <= 0 ? 1 : consumoTotal;
    let costoTotal = 0;

    for (const rango of rangos) {
      let capacidadAgua = Math.min(consumo, rango.rango2 - rango.rango1);
      const costo = capacidadAgua * rango.costo;
      consumo -= capacidadAgua;
      costoTotal += costo;
    }
    return Number(costoTotal.toFixed(2));
  }*/

  private async calcularTarifa(consumoTotal: number, tarifa: Types.ObjectId) {
    const rangos = await this.rangoService.tarifaRangoMedidor(tarifa);
    rangos.sort((a, b) => a.rango1 - b.rango2);
    let total: number = 0;
    console.log(rangos.length);

    for (let i = 0; i < rangos.length; i++) {
      const iva: number = rangos[i].iva / 100;

      if (
        consumoTotal >= rangos[i].rango1 &&
        consumoTotal <= rangos[i].rango2
      ) {
        if (i == 0) {
          const costoIva = parseFloat((rangos[i].costo * iva).toFixed(1));
          total = rangos[i].costo + costoIva;
        } else {
          const costo = consumoTotal * rangos[i].costo;
          const costoIva = parseFloat((costo * iva).toFixed(1));
          total = costo + costoIva;
        }
        return total;
      }
    }
    const iva: number = rangos[rangos.length - 1].iva / 100;
    const costo = consumoTotal * rangos[rangos.length - 1].costo;
    const costoIva = parseFloat((costo * iva).toFixed(1));
    total = costo + costoIva;
    return total;
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

  async editarLectura(id: Types.ObjectId, updateLecturaDto: UpdateLecturaDto) {
    try {
      const lectura = await this.lectura.findOne({
        _id: new Types.ObjectId(id),
        flag: FlagE.nuevo,
        estado: EstadoLecturaE.PENDIENTE,
      });
      if (!lectura) {
        throw new NotFoundException(
          'No se encontro la lectura | ya fue pagada',
        );
      }
      const lecturaActual: number = updateLecturaDto.lecturaActual
        ? updateLecturaDto.lecturaActual
        : 0;

      const lecturaAnterior: number = updateLecturaDto.lecturaAnterior
        ? updateLecturaDto.lecturaAnterior
        : 0;

      const medidor = await this.medidorService.buscarMedidorPorId(
        lectura.medidor,
      );
      if (medidor) {
        const consumo = lecturaActual - lecturaAnterior;
        const costoApagar = await this.calcularTarifa(consumo, medidor.tarifa);
        const data: EditarLecturaI = {
          consumoTotal: consumo,
          lecturaAnterior: updateLecturaDto.lecturaAnterior,
          lecturaActual: updateLecturaDto.lecturaActual,
          costoApagar: costoApagar,
        };
        await this.lectura.updateOne({ _id: new Types.ObjectId(id) }, data);
        return { status: HttpStatus.OK };
      }
    } catch (error) {
      throw error;
    }
  }

  async softDelete(id: Types.ObjectId) {
    const lectura = await this.lectura.findOne({
      _id: new Types.ObjectId(id),
      flag: FlagE.nuevo,
      estado: EstadoLecturaE.PENDIENTE,
    });
    if (!lectura) {
      throw new NotFoundException('No se encontro la lectura | ya fue pagada');
    }

    await this.lectura.updateOne(
      { _id: new Types.ObjectId(id) },
      { flag: FlagE.eliminado },
    );
    return { status: HttpStatus.OK };
  }
}
