import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaGastoController } from './categoria-gasto.controller';
import { CategoriaGastoService } from './categoria-gasto.service';

describe('CategoriaGastoController', () => {
  let controller: CategoriaGastoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriaGastoController],
      providers: [CategoriaGastoService],
    }).compile();

    controller = module.get<CategoriaGastoController>(CategoriaGastoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
