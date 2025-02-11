import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateClienteDto {

  
    @IsString({ message: 'El CI debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El CI es obligatorio' })
  ci: string;

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsString({ message: 'El celular debe ser una cadena de texto' })
  @IsOptional()
  celular: string;

  @IsString({ message: 'El apellido materno debe ser una cadena de texto' })
  @IsOptional()
  apellidoMaterno?: string;

  @IsString({ message: 'El apellido paterno debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido paterno es obligatorio' })
  apellidoPaterno: string;

  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  direccion: string;


  

}
