import { Controller } from '@nestjs/common';
import { CoreAppService } from './core-app.service';

@Controller('core-app')
export class CoreAppController {
  constructor(private readonly coreAppService: CoreAppService) {}
}
