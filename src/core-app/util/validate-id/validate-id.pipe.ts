import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isMongoId } from 'class-validator';
import { Types } from 'mongoose';

@Injectable()
export class ValidateIdPipe implements PipeTransform {
  transform(value: Types.ObjectId ) {
    if(!isMongoId(value)){
      throw new BadRequestException('Ingrese un id valido')
    }
    return value;
  }
}
