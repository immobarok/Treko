import { Module } from '@nestjs/common';
import { BestserviceController } from './bestservice.controller';
import { BestserviceService } from './bestservice.service';

@Module({
  controllers: [BestserviceController],
  providers: [BestserviceService],
})
export class BestserviceModule {}
