import { Test, TestingModule } from '@nestjs/testing';
import { LecturaConsumoController } from './lectura-consumo.controller';
import { LecturaConsumoService } from './lectura-consumo.service';

describe('LecturaConsumoController', () => {
  let controller: LecturaConsumoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LecturaConsumoController],
      providers: [LecturaConsumoService],
    }).compile();

    controller = module.get<LecturaConsumoController>(LecturaConsumoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
