import { Test, TestingModule } from '@nestjs/testing';
import { BestserviceController } from './bestservice.controller';

describe('BestserviceController', () => {
  let controller: BestserviceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BestserviceController],
    }).compile();

    controller = module.get<BestserviceController>(BestserviceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
