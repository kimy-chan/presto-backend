import { Injectable } from '@nestjs/common';
import { CreateTarifaDto } from '../dto/create-tarifa.dto';
import { UpdateTarifaDto } from '../dto/update-tarifa.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Rango } from '../schema/rango.schema';
import { Model, Types } from 'mongoose';
import { RangoDto } from '../dto/rangoTariga.dto';
import { RangoI } from '../interface/rango';
import { log } from 'node:console';
import { FlagE } from 'src/core-app/enums/flag';

@Injectable()
export class RangoService {
    constructor(@InjectModel(Rango.name) private readonly rango:Model<Rango>){}
  async create(rango: RangoI) {
    await this.rango.create(rango)
    return  
  }

  async rangosTarifa(tarifa:Types.ObjectId){
    const rangos = await this.rango.aggregate([
        {
            $match:{tarifa:new Types.ObjectId(tarifa), flag:FlagE.nuevo}
        },
        {
            $lookup:{
                from:"Tarifa",
                foreignField:"_id",
                localField:"tarifa",
                as:"tarifa"
                
            }
            
        },
        {
            $unwind:{path:"$tarifa", preserveNullAndEmptyArrays:false}
        },
        {
            $project:{
                rango1:1,
                rango2:1,
                precio:1,
                tarifa:"$tarifa.nombre"
            }
        }
    ])
    
    
    return rangos
  }

   async tarifaRangoMedidor (tarifa:Types.ObjectId):Promise<RangoI[]>{
    const rangos:RangoI[] = await this.rango.find({tarifa:new Types.ObjectId(tarifa), flag:FlagE.nuevo})
    return  rangos
   }


}
