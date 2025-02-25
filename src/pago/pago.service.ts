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
    const pago = await this.pago.create(realizarPago);
    const lecturaPagada = await this.lecturaService.cambiarEstadoLectura(
      realizarPago.lectura,
    );
    if (pago && lecturaPagada.acknowledged == true) {
      return { status: HttpStatus.CREATED, medidor: lectura.medidor };
    }
    throw new BadRequestException('Ocurrio un error');
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
  findOne(id: number) {
    return `This action returns a #${id} pago`;
  }

  update(id: number, updatePagoDto: UpdatePagoDto) {
    return `This action updates a #${id} pago`;
  }

  remove(id: number) {
    return `This action removes a #${id} pago`;
  }
}
