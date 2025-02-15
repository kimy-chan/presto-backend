import { Test, TestingModule } from '@nestjs/testing';
import { LecturaService } from './lectura.service';

describe('LecturaService', () => {
  let service: LecturaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LecturaService],
    }).compile();

    service = module.get<LecturaService>(LecturaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
