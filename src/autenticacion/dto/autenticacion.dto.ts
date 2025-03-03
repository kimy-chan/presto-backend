import { IsNotEmpty, IsString } from 'class-validator';

export class AutenticacionDto {
  @IsString()
  @IsNotEmpty()
  usuario: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
