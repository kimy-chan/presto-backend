import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cliente } from './schema/cliente.schema';
import { Model } from 'mongoose';
import { FlagE } from 'src/core-app/enums/flag';

@Injectable()
export class ClienteService {
  constructor( @InjectModel(Cliente.name) private readonly cliente:Model<Cliente>){}
  async create(createClienteDto: CreateClienteDto) {
    const cliente = await this.cliente.findOne({ci:createClienteDto.ci, flag:FlagE.nuevo})

    if(cliente && cliente.ci){
      throw new ConflictException('El ci ya se encuentra registrado')
    }
    const codigo = await this.generarCodigo()
    await this.cliente.create({
      apellidoMaterno:createClienteDto.apellidoMaterno,
      apellidoPaterno:createClienteDto.apellidoPaterno,
      celular:createClienteDto.celular,
       codigo:codigo,
       direccion:createClienteDto.direccion,
       ci:createClienteDto.ci,
       nombre:createClienteDto.nombre
    })

    return {status:HttpStatus.CREATED}
  }

  async findAll() {
    const clientes = await this.cliente.find({flag:FlagE.nuevo})
    return  clientes;
  }

  findOne(id: number) {
    return `This action returns a #${id} cliente`;
  }

  update(id: number, updateClienteDto: UpdateClienteDto) {
    
    return `This action updates a #${id} cliente`;
  }

  remove(id: number) {
    return `This action removes a #${id} cliente`;
  }

  private async generarCodigo(){
      let countDocuments = await this.cliente.countDocuments({flag:FlagE.nuevo}) 
      countDocuments  += 1
      const codigo = 'C' + countDocuments.toLocaleString().padStart(6,'0')
      return codigo
  }

}
