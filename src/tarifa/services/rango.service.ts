import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTarifaDto } from '../dto/create-tarifa.dto';
import { UpdateTarifaDto } from '../dto/update-tarifa.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Rango } from '../schema/rango.schema';
import { Model, Types } from 'mongoose';
import { RangoDto } from '../dto/rangoTariga.dto';
import { RangoI } from '../interface/rango';
import { log } from 'node:console';
import { FlagE } from 'src/core-app/enums/flag';
import { EditarRangoDto } from '../dto/EditarRango.dto';

@Injectable()
export class RangoService {
  constructor(@InjectModel(Rango.name) private readonly rango: Model<Rango>) {}

  async create(rango: RangoI) {
    await this.rango.create(rango);
    return;
  }

  async rangosTarifa(tarifa: Types.ObjectId) {
    const rangos = await this.rango.aggregate([
      {
        $match: { tarifa: new Types.ObjectId(tarifa), flag: FlagE.nuevo },
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
          rango1: 1,
          rango2: 1,
          costo: 1,
          iva: 1,
          tarifa: '$tarifa.nombre',
        },
      },
    ]);

    return rangos;
  }

  async tarifaRangoMedidor(tarifa: Types.ObjectId): Promise<RangoI[]> {
    const rangos: RangoI[] = await this.rango.find({
      tarifa: new Types.ObjectId(tarifa),
      flag: FlagE.nuevo,
    });
    return rangos;
  }

  async rangoOne(id: Types.ObjectId) {
    const rango = await this.rango.findOne({
      _id: new Types.ObjectId(id),
      flag: FlagE.nuevo,
    });
    if (!rango) {
      throw new NotFoundException('El Rango no existe');
    }
    return { status: HttpStatus.OK, data: rango };
  }

  async editarRango(id: Types.ObjectId, editarRangoDto: EditarRangoDto) {
    try {
      const rango = await this.rango.findOne({
        _id: new Types.ObjectId(id),
        flag: FlagE.nuevo,
      });
      if (!rango) {
        throw new NotFoundException('El Rango no existe');
      }

      await this.rango.updateOne(
        { _id: new Types.ObjectId(id) },
        editarRangoDto,
      );
      return { status: HttpStatus.OK };
    } catch (error) {
      throw error;
    }
  }

  async softDelete(id: Types.ObjectId) {
    try {
      const rango = await this.rango.findOne({
        _id: new Types.ObjectId(id),
        flag: FlagE.nuevo,
      });
      if (!rango) {
        throw new NotFoundException();
      }
      await this.rango.updateOne(
        { _id: new Types.ObjectId(id) },
        { flag: FlagE.eliminado },
      );
      return { status: HttpStatus.OK };
    } catch (error) {
      throw error;
    }
  }
}
