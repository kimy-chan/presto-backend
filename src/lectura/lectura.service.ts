import { BadRequestException, forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateLecturaDto } from './dto/create-lectura.dto';
import { UpdateLecturaDto } from './dto/update-lectura.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Lectura } from './schemas/lectura.schema';
import { Model, Types } from 'mongoose';
import { FlagE } from 'src/core-app/enums/flag';
import { LecturaI } from './interface/lectura';
import { PagoService } from 'src/pago/pago.service';
import { MedidorService } from 'src/medidor/medidor.service';
import { DataLecturaI } from './interface/dataLectura';

@Injectable()
export class LecturaService {
  constructor(
    @InjectModel(Lectura.name) private readonly lectura:Model<Lectura>,
    private readonly pagoService:PagoService,
    @Inject(forwardRef(()=>MedidorService )) private readonly medidorService:MedidorService
  ){}
   async  create(createLecturaDto: CreateLecturaDto) {
      const consumo =   createLecturaDto.lecturaActual- createLecturaDto.lecturaAnterior      
      if(consumo < 0) {
        throw new BadRequestException('Ingre las lecturas correctas')
      }
      const dataLectura:LecturaI ={
        codigo: await this.codigoLectura(new Types.ObjectId(createLecturaDto.medidor)),
        consumoTotal: consumo,
        lecturaActual:createLecturaDto.lecturaActual,
        lecturaAnterior:createLecturaDto.lecturaAnterior,
        medidor:new Types.ObjectId(createLecturaDto.medidor),
        mes:createLecturaDto.mes
      
      
  
      }
     
     const lectura= await this.lectura.create(dataLectura)
       const medidor  = await this.medidorService.tarifaMedidor(lectura.medidor)
      if(lectura && medidor && medidor.tarifa){
          const data:DataLecturaI={
            _id:lectura._id,
            codigo:lectura.codigo,
            consumoTotal:lectura.consumoTotal,
            medidor:lectura.medidor,
            tarifa:medidor.tarifa,
            usuario:'prueba'

          }
            await this.pagoService.crearPago(data)
                return {status:HttpStatus.CREATED, lectura:lectura._id};
            
        }
        throw new BadRequestException('Hubo un error inesperado')
    
  
  }

  async buscarLecturaAnterior (medidor:Types.ObjectId){
    const lectuta = await this.lectura.findOne({medidor:new Types.ObjectId(medidor), flag:FlagE.nuevo}).sort({codigo:-1}).limit(1)
    return lectuta

  }

  private async codigoLectura (medidor:Types.ObjectId){
    let codigo = await this.lectura.countDocuments({medidor:new Types.ObjectId(medidor), flag:FlagE.nuevo})
    codigo +=1
    return codigo
  } 

   async reciboLectura(id:Types.ObjectId) {
      const recibo = await this.lectura.aggregate([
          {
            $match:{
              _id:new Types.ObjectId(id)
            }
          },
          {
            $lookup:{
              from:'Medidor',
               foreignField:'_id',
                localField:'medidor',
                as:'medidor'
            }
          },
          {
            $unwind:{path:'$medidor', preserveNullAndEmptyArrays:false}
          },
            {
            $lookup:{
              from:'Tarifa',
               foreignField:'_id',
                localField:'medidor.tarifa',
                as:'tarifa'
            }
          },
          {
            $unwind:{path:'$tarifa', preserveNullAndEmptyArrays:false}
          },
           {  $lookup:{
              from:'Cliente',
               foreignField:'_id',
                localField:'medidor.cliente',
                as:'cliente'
            }
          },
          {
            $unwind:{path:'$cliente', preserveNullAndEmptyArrays:false}
          },

             {  $lookup:{
              from:'Pago',
               foreignField:'lectura',
                localField:'_id',
                as:'pago'
            }
          },
          {
            $unwind:{path:'$pago', preserveNullAndEmptyArrays:false}
          },
          {
            $project:{
              codigoCliente:'$cliente.codigo',
              numeroMedidor:'$medidor.numeroMedidor',
              nombre:'$cliente.nombre',
               apellidoPaterno:'$cliente.apellidoPaterno',
               apellidoMaterno:'$cliente.apellidoMaterno',
                direccion:'$medidor.direccion',
              categoria:'$tarifa.nombre',
                fecha:1,
                lecturaActual:1,
                  lecturaAnterior:1,
                  consumoTotal:1,
                  costoApagar:'$pago.costoApagar'

            }
          }



        ])
        return {status:HttpStatus.OK, data:recibo[0]}
          
    } 
  findAll() {
    return `This action returns all lectura`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lectura`;
  }

  update(id: number, updateLecturaDto: UpdateLecturaDto) {
    return `This action updates a #${id} lectura`;
  }

  remove(id: number) {
    return `This action removes a #${id} lectura`;
  }
}
