import { ConfigModule, ConfigService } from '@nestjs/config';

ConfigModule.forRoot({ isGlobal: true });
const configService = new ConfigService();

export const coneccionBasesDeDatos = configService.get<string>('DATABASE');
