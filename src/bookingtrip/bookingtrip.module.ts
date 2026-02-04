import { Module } from '@nestjs/common';
import { BookingtripController } from './bookingtrip.controller';
import { BookingtripService } from './bookingtrip.service';

@Module({
  controllers: [BookingtripController],
  providers: [BookingtripService],
})
export class BookingtripModule {}
