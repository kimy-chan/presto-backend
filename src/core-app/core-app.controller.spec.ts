import { Test, TestingModule } from '@nestjs/testing';
import { CoreAppController } from './core-app.controller';
import { CoreAppService } from './core-app.service';

describe('CoreAppController', () => {
  let controller: CoreAppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoreAppController],
      providers: [CoreAppService],
    }).compile();

    controller = module.get<CoreAppController>(CoreAppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
