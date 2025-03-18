import {
  BadGatewayException,
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Param,
  Type,
} from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Model, Types } from 'mongoose';
import { LecturaI } from 'src/lectura/interface/lectura';
import { DataLecturaI } from 'src/lectura/interface/dataLectura';
import { RangoService } from 'src/tarifa/services/rango.service';
import { InjectModel } from '@nestjs/mongoose';
import { Pago } from './schemas/pago.schema';
import { PagoI } from './interface/pago';
import { BuscarPagoDto } from './dto/buscarPago.dto';
import { FlagE } from 'src/core-app/enums/flag';
import { RealizarPago } from './dto/realizarPago.dto';
import { LecturaService } from 'src/lectura/lectura.service';
import { ClienteService } from 'src/cliente/cliente.service';
import { MedidorService } from 'src/medidor/medidor.service';
import { format } from 'path';
import { BuscadorClienteDto } from 'src/cliente/dto/BuscadorCliente.dto';
import { BuscadorPagosClienteI } from './interface/buscadorPagoCliente';
import { BuscarPagoClienteDto } from './dto/BuscarPagoCliente.dto';

@Injectable()
export class PagoService {
  constructor(
    @InjectModel(Pago.name) private readonly pago: Model<Pago>,
    private readonly lecturaService: LecturaService,
    private readonly medidorService: MedidorService,
  ) {}

  async realizarPago(realizarPago: RealizarPago, usuario: Types.ObjectId) {
    const lectura = await this.lecturaService.lecturaFindOne(
      realizarPago.lectura,
    );
    if (!lectura) {
      throw new NotFoundException('Lectura no encontrada');
    }
    if (lectura.costoApagar != realizarPago.costoPagado) {
      return new BadRequestException('Cancele el monto exacto');
    }
    realizarPago.lectura = new Types.ObjectId(realizarPago.lectura);
    realizarPago.numeroPago = await this.numeroDePago();
    realizarPago.usuario = new Types.ObjectId(usuario);
    const pago = await this.pago.create(realizarPago);
    const lecturaPagada = await this.lecturaService.cambiarEstadoLectura(
      realizarPago.lectura,
    );
    if (pago && lecturaPagada.modifiedCount > 0) {
      return { status: HttpStatus.CREATED, medidor: lectura.medidor };
    }
    throw new BadRequestException('Ocurrio un error');
  }

  private async numeroDePago() {
    let numero = await this.pago.countDocuments({ flag: FlagE.nuevo });
    numero + 1;
    return String(numero);
  }
  async pagosCliente(medidor: Types.ObjectId) {
    const [cliente, pagos] = await Promise.all([
      this.medidorService.medidorCienteData(medidor),
      this.pago.aggregate([
        {
          $match: {
            flag: FlagE.nuevo,
          },
        },
        {
          $lookup: {
            from: 'Lectura',
            foreignField: '_id',
            localField: 'lectura',
            as: 'lectura',
          },
        },
        {
          $unwind: { path: '$lectura', preserveNullAndEmptyArrays: false },
        },
        {
          $match: {
            'lectura.medidor': new Types.ObjectId(medidor),
          },
        },
        {
          $project: {
            gestion: '$lectura.gestion',
            mes: '$lectura.mes',
            lecturaActual: '$lectura.lecturaActual',
            lecturaAnterior: '$lectura.lecturaAnterior',
            consumoTotal: '$lectura.consumoTotal',
            costoPagado: 1,
            observaciones: 1,
            fecha: {
              $dateToString: {
                format: '%Y/%m/%d',
                date: '$fecha',
              },
            },
          },
        },
      ]),
    ]);
    return { status: HttpStatus.OK, pagos: pagos, cliente: cliente };
  }

  private buscadorPagosCliente(buscadorClienteDto: BuscarPagoClienteDto) {
    const filter: BuscadorPagosClienteI = {};
    buscadorClienteDto.ci ? (filter.ci = buscadorClienteDto.ci) : filter;
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
    buscadorClienteDto.numeroMedidor
      ? (filter.numeroMedidor = buscadorClienteDto.numeroMedidor)
      : filter;

    buscadorClienteDto.fechaInicio && buscadorClienteDto.fechaFin
      ? (filter.fecha = {
          $gte: new Date(
            new Date(buscadorClienteDto.fechaInicio).setUTCHours(0, 0, 0, 0),
          ),
          $lte: new Date(
            new Date(buscadorClienteDto.fechaFin).setUTCHours(23, 59, 39, 999),
          ),
        })
      : filter;

    return filter;
  }

  async listarPagos(buscadorClienteDto: BuscarPagoClienteDto) {
    const {
      apellidoMaterno,
      apellidoPaterno,
      ci,
      fecha,
      nombre,
      numeroMedidor,
    } = this.buscadorPagosCliente(buscadorClienteDto);

    try {
      const pagos = await this.pago.aggregate([
        {
          $match: {
            flag: FlagE.nuevo,
            ...(fecha ? { fecha: fecha } : {}),
          },
        },

        {
          $lookup: {
            from: 'Lectura',
            foreignField: '_id',
            localField: 'lectura',
            as: 'lectura',
          },
        },

        {
          $match: {
            'lectura.flag': FlagE.nuevo,
          },
        },
        {
          $unwind: { path: '$lectura', preserveNullAndEmptyArrays: false },
        },

        {
          $lookup: {
            from: 'Medidor',
            foreignField: '_id',
            localField: 'lectura.medidor',
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
          ? [
              {
                $match: {
                  'medidor.numeroMedidor': numeroMedidor,
                },
              },
            ]
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
          $match: {
            'cliente.flag': FlagE.nuevo,
          },
        },
        ...(ci
          ? [
              {
                $match: {
                  'cliente.ci': ci,
                },
              },
            ]
          : []),

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
          $project: {
            _id: 1,
            codigoCliente: '$cliente.codigo',
            ci: '$cliente.ci',
            nombre: '$cliente.nombre',
            apellidoPaterno: '$cliente.apellidoPaterno',
            apellidoMaterno: '$cliente.apellidoMaterno',
            tarifa: '$tarifa.nombre',
            codigoMedidor: '$medidor.codigo',
            numeroMedidor: '$medidor.numeroMedidor',
            medidor: '$lectura.medidor',
            lecturaActual: '$lectura.lecturaActual',
            lecturaAnterior: '$lectura.lecturaAnterior',
            consumoTotal: '$lectura.consumoTotal',
            costoApagar: '$lectura.costoApagar',
            mes: '$lectura.mes',
            estado: '$lectura.estado',
            costoPagado: 1,
            fecha: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$fecha',
              },
            },
            numeroPago: 1,
          },
        },
        {
          $facet: {
            data: [
              {
                $limit: buscadorClienteDto.limite,
              },
              {
                $skip:
                  (buscadorClienteDto.pagina - 1) * buscadorClienteDto.limite,
              },
            ],
            documentos: [
              {
                $count: 'total',
              },
            ],
          },
        },
      ]);
      const documentos = pagos[0].documentos[0]
        ? pagos[0].documentos[0].total
        : 1;

      const paginas = Math.ceil(documentos / buscadorClienteDto.limite);
      return { status: HttpStatus.OK, data: pagos[0].data, paginas };
    } catch (error) {
      console.log(error);
    }
  }
}
