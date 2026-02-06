import { Test, TestingModule } from '@nestjs/testing';
import { BestserviceService } from './bestservice.service';

describe('BestserviceService', () => {
  let service: BestserviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BestserviceService],
    }).compile();

    service = module.get<BestserviceService>(BestserviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
