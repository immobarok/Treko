import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/context/prisma.service';
import { CreateBookingDto } from './dto/create.booking.dto';

@Injectable()
export class BookingtripService {
  private readonly logger = new Logger(BookingtripService.name);

  constructor(private prisma: PrismaService) {}

  async createBookingTrip(createBooking: CreateBookingDto) {
    const travelDate = new Date(createBooking.travelDate);
    if (isNaN(travelDate.getTime())) {
      throw new BadRequestException('Invalid travel date format.');
    }

    // Business logic: Check if trip exists
    const trip = await this.prisma.trip.findUnique({
      where: { id: createBooking.tripId },
    });
    if (!trip) {
      throw new NotFoundException('Trip not found.');
    }

    // Business logic: Check availability (example: if trip has capacity)
    // Assume Trip model has a 'capacity' field; adjust as needed
    const existingBookings = await this.prisma.booking.count({
      where: {
        tripId: createBooking.tripId,
        travelDate: travelDate,
        status: 'CONFIRMED', // Adjust based on your enum
      },
    });
    if (
      existingBookings + createBooking.adults + createBooking.children >
      trip.capacity
    ) {
      throw new ConflictException(
        'Not enough availability for the selected trip and date.',
      );
    }

    // Optional: Check if user exists (if userId is provided)
    if (createBooking.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: createBooking.userId },
      });
      if (!user) {
        throw new NotFoundException('User not found.');
      }
    }

    try {
      // Use a transaction for atomicity (e.g., if payment is involved later)
      const booking = await this.prisma.$transaction(async (tx) => {
        return await tx.booking.create({
          data: {
            ...createBooking,
            travelDate: travelDate, // Ensure it's a Date object
          },
        });
      });

      this.logger.log(`Booking created successfully: ${booking.id}`);
      return booking;
    } catch (error) {
      this.logger.error(`Database Error: ${error.message}`, error.stack);
      // Throw specific exceptions based on error type
      if (error.code === 'P2002') {
        // Prisma unique constraint error
        throw new ConflictException('Booking already exists for this data.');
      }
      throw new BadRequestException(
        'Failed to create booking due to database error.',
      );
    }
  }
}
