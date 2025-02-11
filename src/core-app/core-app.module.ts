import { Module } from '@nestjs/common';
import { CoreAppService } from './core-app.service';
import { CoreAppController } from './core-app.controller';

@Module({
  controllers: [CoreAppController],
  providers: [CoreAppService],
})
export class CoreAppModule {}
