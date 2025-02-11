import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaGastoService } from './categoria-gasto.service';

describe('CategoriaGastoService', () => {
  let service: CategoriaGastoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriaGastoService],
    }).compile();

    service = module.get<CategoriaGastoService>(CategoriaGastoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
