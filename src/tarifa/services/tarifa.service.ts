import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTarifaDto } from '../dto/create-tarifa.dto';
import { UpdateTarifaDto } from '../dto/update-tarifa.dto';
import { time } from 'console';
import { InjectModel } from '@nestjs/mongoose';
import { Tarifa } from '../schema/tarifa.schema';
import { Model } from 'mongoose';
import { RangoI } from '../interface/rango';
import { RangoService } from './rango.service';
import { FlagE } from 'src/core-app/enums/flag';

@Injectable()
export class TarifaService {
  constructor(@InjectModel(Tarifa.name) private readonly tarifa:Model<Tarifa>,
    private readonly rangoService:RangoService
){}
  async create(createTarifaDto: CreateTarifaDto) {
    const verificarTarifa = await this.tarifa.findOne({nombre:createTarifaDto.nombre, flag:FlagE.nuevo})
    if(verificarTarifa && verificarTarifa.nombre){
      throw new ConflictException('La tarifa ya se encuentra registrada')
    }
    const tarifa = await this.tarifa.create({nombre:createTarifaDto.nombre})
    for (const rango of createTarifaDto.rangos) {
      const data:RangoI={
        costo:rango.costo,
        rango1:rango.rango1,
        rango2:rango.rango2,
        tarifa:tarifa._id
      }
      await this.rangoService.create(data)
      
    }
    return {status:HttpStatus.CREATED}
  }

  async findAll() {
    const tarifas = await this.tarifa.find({flag:FlagE.nuevo})
    return  tarifas;
  }

  findOne(id: number) {
    return `This action returns a #${id} tarifa`;
  }

  update(id: number, updateTarifaDto: UpdateTarifaDto) {
    return `This action updates a #${id} tarifa`;
  }

  remove(id: number) {
    return `This action removes a #${id} tarifa`;
  }
}
