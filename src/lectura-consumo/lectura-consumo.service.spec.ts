import { Test, TestingModule } from '@nestjs/testing';
import { LecturaConsumoService } from './lectura-consumo.service';

describe('LecturaConsumoService', () => {
  let service: LecturaConsumoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LecturaConsumoService],
    }).compile();

    service = module.get<LecturaConsumoService>(LecturaConsumoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
