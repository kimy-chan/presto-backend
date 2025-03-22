import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClienteDto {
  @IsString({ message: 'El CI debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El CI es obligatorio' })
  @Transform(({ value }: { value: string }) => value.trim())
  ci: string;

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @Transform(({ value }: { value: string }) => value.trim())
  nombre: string;

  @IsString({ message: 'El celular debe ser una cadena de texto' })
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.trim())
  celular: string;

  @IsString({ message: 'El apellido materno debe ser una cadena de texto' })
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.trim())
  apellidoMaterno?: string;

  @IsString({ message: 'El apellido paterno debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido paterno es obligatorio' })
  @Transform(({ value }: { value: string }) => value.trim())
  apellidoPaterno: string;

  /*@IsString({ message: 'La dirección debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  direccion: string; */
}
