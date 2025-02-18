import { Injectable, Type } from '@nestjs/common';
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

@Injectable()
export class PagoService {
  constructor(
    @InjectModel(Pago.name) private readonly pago:Model<Pago>,
    private readonly rangoService:RangoService
  ){}
  create(createPagoDto: CreatePagoDto) {
    return 'This action adds a new pago';

  }


async crearPago(lectura: DataLecturaI) {
    const date = new Date()
    const constoTotal = await this.calcularTarifa(lectura)
    
    const data:PagoI ={
      aqo:date.getFullYear().toString(),
      costoApagar:constoTotal,
      lectura:lectura._id,
    }
    await this.pago.create(data)
    return      

}



// sacamos el costo por la capacidad de agua de cada  taria
private  async calcularTarifa (lectura:DataLecturaI){
      const rangos = await this.rangoService.tarifaRangoMedidor(lectura.tarifa);
      let consumo = lectura.consumoTotal // lectura actual
      let costoTotal = 0
      for (const rango of rangos) {
        let capacidadAgua = Math.min(consumo, rango.rango2 - rango.rango1); // capacidad de agua que del rango      
        const costo = capacidadAgua * rango.costo
          consumo -= capacidadAgua
          costoTotal += costo     
      }
    return costoTotal

}

buscarPago(buscarPagoDto:BuscarPagoDto){
  console.log(buscarPagoDto);
  

}

  findAll() {
    return `This action returns all pago`;
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
