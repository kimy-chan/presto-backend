import {
  BadGatewayException,
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
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

@Injectable()
export class PagoService {
  constructor(
    @InjectModel(Pago.name) private readonly pago: Model<Pago>,
    private readonly lecturaService: LecturaService,
    private readonly medidorService: MedidorService,
  ) {}

  async realizarPago(realizarPago: RealizarPago) {
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
    const pago = await this.pago.create(realizarPago);
    const lecturaPagada = await this.lecturaService.cambiarEstadoLectura(
      realizarPago.lectura,
    );
    if (pago && lecturaPagada.acknowledged == true) {
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
          },
        },
      ]),
    ]);
    return { status: HttpStatus.OK, pagos: pagos, cliente: cliente };
  }

  async listarPagos(buscadorClienteDto: BuscadorClienteDto) {
    console.log(buscadorClienteDto);

    try {
      const pagos = await this.pago.aggregate([
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
            codigoMedidor: '$medidor.codigo',
            numeroMedidor: '$medidor.numeroMedidor',
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
      ]);
      return pagos;
    } catch (error) {
      console.log(error);
    }
  }
}
