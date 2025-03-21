import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Gasto } from './schema/gasto.schema';
import { Model, Types } from 'mongoose';
import { FlagE } from 'src/core-app/enums/flag';
import { BuscadorGasto } from './dto/BuscarGasto.dto';

import { BuscadorGastoI } from './interface/buscadorGasto';

@Injectable()
export class GastoService {
  constructor(@InjectModel(Gasto.name) private readonly gasto: Model<Gasto>) {}
  async create(createGastoDto: CreateGastoDto) {
    createGastoDto.costoAqo =
      createGastoDto.cantidad * createGastoDto.costoUnitario;
    createGastoDto.categoriaGasto = new Types.ObjectId(
      createGastoDto.categoriaGasto,
    );
    await this.gasto.create(createGastoDto);
    return { status: HttpStatus.CREATED };
  }

  async buscadorGasto(buscadorGasto: BuscadorGasto) {
    const filter: BuscadorGastoI = {};
    buscadorGasto.categoriaGasto
      ? (filter.categoriaGasto = new Types.ObjectId(
          buscadorGasto.categoriaGasto,
        ))
      : filter;
    buscadorGasto.fechaInicio && buscadorGasto.fechaFin
      ? (filter.fecha = {
          $gte: new Date(buscadorGasto.fechaInicio),
          $lte: new Date(buscadorGasto.fechaFin),
        })
      : filter;

    return filter;
  }

  async listarGasto(buscadorGasto: BuscadorGasto) {
    const filter = await this.buscadorGasto(buscadorGasto);

    const countDocuments = await this.gasto.countDocuments({
      flag: FlagE.nuevo,
      ...filter,
    });

    const paginas = Math.ceil(countDocuments / buscadorGasto.limite);
    const gasto = await this.gasto.aggregate([
      {
        $match: { flag: FlagE.nuevo, ...filter },
      },
      {
        $lookup: {
          from: 'CategoriaGasto',
          foreignField: '_id',
          localField: 'categoriaGasto',
          as: 'categoriaGasto',
        },
      },
      {
        $unwind: { path: '$categoriaGasto', preserveNullAndEmptyArrays: false },
      },
      {
        $project: {
          descripcion: 1,
          unidadManejo: 1,
          cantidad: 1,
          factorValides: 1,
          costoUnitario: 1,
          costoAqo: 1,
          fecha: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$fecha',
            },
          },
          categoria: '$categoriaGasto.nombre',
        },
      },
      {
        $skip: (buscadorGasto.pagina - 1) * buscadorGasto.limite,
      },
      {
        $limit: buscadorGasto.limite,
      },
    ]);

    return { status: HttpStatus.OK, data: gasto, paginas: paginas };
  }

  async findOne(id: Types.ObjectId) {
    const gasto = await this.gasto.findOne({
      _id: new Types.ObjectId(id),
      flag: FlagE.nuevo,
    });

    if (!gasto) {
      throw new NotFoundException();
    }
    return { status: HttpStatus.OK, data: gasto };
  }

  async editarGasto(id: Types.ObjectId, updateGastoDto: UpdateGastoDto) {
    const gasto = await this.gasto.findOne({
      _id: new Types.ObjectId(id),
      flag: FlagE.nuevo,
    });
    if (!gasto) {
      throw new NotFoundException();
    }
    const cantidad = updateGastoDto.cantidad ? updateGastoDto.cantidad : 0;
    const costoUnitario = updateGastoDto.costoUnitario
      ? updateGastoDto.costoUnitario
      : 0;
    updateGastoDto.costoAqo = cantidad * costoUnitario;

    updateGastoDto.categoriaGasto = new Types.ObjectId(
      updateGastoDto.categoriaGasto,
    );
    await this.gasto.updateOne({ _id: new Types.ObjectId(id) }, updateGastoDto);
    return { status: HttpStatus.OK };
  }

  async softDelete(id: Types.ObjectId) {
    const gasto = await this.gasto.findOne({
      _id: new Types.ObjectId(id),
      flag: FlagE.nuevo,
    });

    if (!gasto) {
      throw new NotFoundException();
    }
    await this.gasto.updateOne(
      { _id: new Types.ObjectId(id) },
      { flag: FlagE.eliminado },
    );
    return { status: HttpStatus.OK };
  }
}
