import { Body, Controller, Post } from '@nestjs/common';
import { BookingtripService } from './bookingtrip.service';
import { CreateBookingDto } from './dto/create.booking.dto';

@Controller('bookingtrip')
export class BookingtripController {
  constructor(private readonly bookingtripService: BookingtripService){}
  @Post('create')
  async createBookingTrip(@Body() createBooking: CreateBookingDto) {
    return this.bookingtripService.createBookingTrip(createBooking);
  }
}
