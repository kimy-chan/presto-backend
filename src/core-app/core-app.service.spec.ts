import { Test, TestingModule } from '@nestjs/testing';
import { CoreAppService } from './core-app.service';

describe('CoreAppService', () => {
  let service: CoreAppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreAppService],
    }).compile();

    service = module.get<CoreAppService>(CoreAppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
