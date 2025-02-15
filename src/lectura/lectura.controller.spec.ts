import { Test, TestingModule } from '@nestjs/testing';
import { LecturaController } from './lectura.controller';
import { LecturaService } from './lectura.service';

describe('LecturaController', () => {
  let controller: LecturaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LecturaController],
      providers: [LecturaService],
    }).compile();

    controller = module.get<LecturaController>(LecturaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
