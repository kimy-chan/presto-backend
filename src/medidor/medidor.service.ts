import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMedidorDto } from './dto/create-medidor.dto';
import { UpdateMedidorDto } from './dto/update-medidor.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Medidor } from './schema/medidor.schema';
import { Model, Types } from 'mongoose';
import { FlagE } from 'src/core-app/enums/flag';

@Injectable()
export class MedidorService {
  constructor(@InjectModel(Medidor.name) private readonly medidor:Model<Medidor>){}
 async create(createMedidorDto: CreateMedidorDto) {
    const medidor = await this.medidor.findOne({numeroSerie:createMedidorDto.numeroSerie, flag:FlagE.nuevo})

    if(medidor && medidor.numeroSerie){
      throw new ConflictException('El numero de serie ya existe')
    }
    const codigo = await this.generarCodigo()
    createMedidorDto.codigo =codigo
    createMedidorDto.cliente = new Types.ObjectId(createMedidorDto.cliente)
    await this.medidor.create(createMedidorDto)
    return {status:HttpStatus.CREATED};
  }

  findAll() {
    return `This action returns all medidor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} medidor`;
  }

  update(id: number, updateMedidorDto: UpdateMedidorDto) {
    return `This action updates a #${id} medidor`;
  }

  remove(id: number) {
    return `This action removes a #${id} medidor`;
  }
    private async generarCodigo(){
        let countDocuments = await this.medidor.countDocuments({flag:FlagE.nuevo}) 
        countDocuments  += 1
        const codigo = 'M' + countDocuments.toLocaleString().padStart(6,'0')
        return codigo
    }
  
  
}
