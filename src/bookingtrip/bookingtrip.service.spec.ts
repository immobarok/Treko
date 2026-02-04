import { Test, TestingModule } from '@nestjs/testing';
import { BookingtripService } from './bookingtrip.service';

describe('BookingtripService', () => {
  let service: BookingtripService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingtripService],
    }).compile();

    service = module.get<BookingtripService>(BookingtripService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
