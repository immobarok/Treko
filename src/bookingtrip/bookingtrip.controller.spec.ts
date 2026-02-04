import { Test, TestingModule } from '@nestjs/testing';
import { BookingtripController } from './bookingtrip.controller';

describe('BookingtripController', () => {
  let controller: BookingtripController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingtripController],
    }).compile();

    controller = module.get<BookingtripController>(BookingtripController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
