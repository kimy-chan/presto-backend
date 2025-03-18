import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaGastoDto } from './dto/create-categoria-gasto.dto';
import { UpdateCategoriaGastoDto } from './dto/update-categoria-gasto.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CategoriaGasto } from './schema/categoriaGasto.schema';
import { Model, Types } from 'mongoose';
import { FlagE } from 'src/core-app/enums/flag';
import { PaginadorDto } from 'src/core-app/dto/Paginador.dto';

@Injectable()
export class CategoriaGastoService {
  constructor(
    @InjectModel(CategoriaGasto.name)
    private readonly categoriaGasto: Model<CategoriaGasto>,
  ) {}
  async create(createCategoriaGastoDto: CreateCategoriaGastoDto) {
    await this.categoriaGasto.create(createCategoriaGastoDto);
    return { status: HttpStatus.CREATED };
  }

  async findAll(paginadorDto: PaginadorDto) {
    const countDocuments = await this.categoriaGasto.countDocuments({
      flag: FlagE.nuevo,
    });
    const paginas = Math.ceil(countDocuments / paginadorDto.limite);
    const categorias = await this.categoriaGasto
      .find({ flag: FlagE.nuevo })
      .skip((paginadorDto.pagina - 1) * paginadorDto.limite)
      .limit(paginadorDto.limite);
    return { status: HttpStatus.OK, data: categorias, paginas: paginas };
  }

  async listarCategoriaGasto() {
    const categorias = await this.categoriaGasto.find({ flag: FlagE.nuevo });

    return categorias;
  }
  async findOne(id: Types.ObjectId) {
    const gasto = await this.categoriaGasto.findOne({
      _id: new Types.ObjectId(id),
      flag: FlagE.nuevo,
    });

    if (!gasto) {
      throw new NotFoundException();
    }
    return { status: HttpStatus.OK, data: gasto };
  }

  async editarCategoria(
    id: Types.ObjectId,
    updateCategoriaGastoDto: UpdateCategoriaGastoDto,
  ) {
    const cat = await this.categoriaGasto.findOne({
      _id: new Types.ObjectId(id),
      flag: FlagE.nuevo,
    });

    if (!cat) {
      throw new NotFoundException();
    }
    await this.categoriaGasto.updateOne(
      { _id: new Types.ObjectId(id) },
      updateCategoriaGastoDto,
    );
    return { status: HttpStatus.OK };
  }

  async softDelete(id: Types.ObjectId) {
    const cat = await this.categoriaGasto.findOne({
      _id: new Types.ObjectId(id),
      flag: FlagE.nuevo,
    });

    if (!cat) {
      throw new NotFoundException();
    }
    await this.categoriaGasto.updateOne(
      { _id: new Types.ObjectId(id) },
      { flag: FlagE.eliminado },
    );
    return { status: HttpStatus.OK };
  }
}
