import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTarifaDto } from '../dto/create-tarifa.dto';
import { UpdateTarifaDto } from '../dto/update-tarifa.dto';
import { time } from 'console';
import { InjectModel } from '@nestjs/mongoose';
import { Tarifa } from '../schema/tarifa.schema';
import { Model, Types } from 'mongoose';
import { RangoI } from '../interface/rango';
import { RangoService } from './rango.service';
import { FlagE } from 'src/core-app/enums/flag';

@Injectable()
export class TarifaService {
  constructor(
    @InjectModel(Tarifa.name) private readonly tarifa: Model<Tarifa>,
    private readonly rangoService: RangoService,
  ) {}
  async create(createTarifaDto: CreateTarifaDto) {
    const verificarTarifa = await this.tarifa.findOne({
      nombre: createTarifaDto.nombre,
      flag: FlagE.nuevo,
    });
    if (verificarTarifa && verificarTarifa.nombre) {
      throw new ConflictException('La tarifa ya se encuentra registrada');
    }
    const tarifa = await this.tarifa.create({ nombre: createTarifaDto.nombre });
    for (const rango of createTarifaDto.rangos) {
      const data: RangoI = {
        costo: rango.costo,
        rango1: rango.rango1,
        rango2: rango.rango2,
        tarifa: tarifa._id,
        iva: rango.iva,
      };
      await this.rangoService.create(data);
    }
    return { status: HttpStatus.CREATED };
  }

  async findAll() {
    const tarifas = await this.tarifa.find({ flag: FlagE.nuevo });
    return tarifas;
  }

  async findOne(id: Types.ObjectId) {
    try {
      const tarifa = await this.tarifa.findOne({
        _id: new Types.ObjectId(id),
        flag: FlagE.nuevo,
      });
      if (!tarifa) {
        throw new NotFoundException('No existe la tarifa');
      }
      return { status: HttpStatus.OK, data: { nombre: tarifa.nombre } };
    } catch (error) {
      throw error;
    }
  }

  async editarTarifa(id: Types.ObjectId, updateTarifaDto: UpdateTarifaDto) {
    try {
      const tarifa = await this.tarifa.findOne({
        _id: { $ne: new Types.ObjectId(id) },
        nombre: updateTarifaDto.nombre,
        flag: FlagE.nuevo,
      });
      if (tarifa) {
        throw new ConflictException('La tarifa ya existe');
      }
      await this.tarifa.updateOne(
        { _id: new Types.ObjectId(id) },
        { nombre: updateTarifaDto.nombre },
      );
      return { status: HttpStatus.OK };
    } catch (error) {
      throw error;
    }
  }

  async softDelete(id: Types.ObjectId) {
    try {
      const tarifa = await this.tarifa.findOne({
        _id: new Types.ObjectId(id),
        flag: FlagE.nuevo,
      });
      if (!tarifa) {
        throw new NotFoundException();
      }
      await this.tarifa.updateOne(
        { _id: new Types.ObjectId(id) },
        { flag: FlagE.eliminado },
      );
      return { status: HttpStatus.OK };
    } catch (error) {
      throw error;
    }
  }
}
