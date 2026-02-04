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

  constructor(private readonly prisma: PrismaService) {}

  async createBookingTrip(createBooking: CreateBookingDto) {
    /* -------------------------------------------------------
       1️⃣ Validate & normalize travel date
    ------------------------------------------------------- */
    const travelDate = new Date(createBooking.travelDate);
    if (isNaN(travelDate.getTime())) {
      throw new BadRequestException('Invalid travel date format.');
    }
    // Normalize to midnight UTC to match DB availability dates
    travelDate.setUTCHours(0, 0, 0, 0);

    /* -------------------------------------------------------
       2️⃣ Check if trip exists
    ------------------------------------------------------- */
    const trip = await this.prisma.trip.findUnique({
      where: { id: createBooking.tripId },
      select: { id: true },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found.');
    }

    /* -------------------------------------------------------
       3️⃣ Find availability for selected date
    ------------------------------------------------------- */
    const availability = await this.prisma.tripAvailability.findFirst({
      where: {
        tripId: createBooking.tripId,
        date: travelDate,
      },
    });

    if (!availability) {
      throw new NotFoundException(
        'No availability found for the selected trip and date.',
      );
    }

    /* -------------------------------------------------------
       4️⃣ Calculate requested seats
    ------------------------------------------------------- */
    const adults = createBooking.adults ?? 0;
    const children = createBooking.children ?? 0;
    const requestedSeats = adults + children;

    if (requestedSeats <= 0) {
      throw new BadRequestException(
        'At least one traveler (adult or child) is required.',
      );
    }

    /* -------------------------------------------------------
       5️⃣ Check availability capacity
    ------------------------------------------------------- */
    if (availability.bookedCount + requestedSeats > availability.maxTravelers) {
      throw new ConflictException(
        'Not enough availability for the selected trip and date.',
      );
    }

    /* -------------------------------------------------------
       6️⃣ Optional: Check user existence
    ------------------------------------------------------- */
    if (createBooking.userId) {
      const userExists = await this.prisma.user.findUnique({
        where: { id: createBooking.userId },
        select: { id: true },
      });

      if (!userExists) {
        throw new NotFoundException('User not found.');
      }
    }

    /* -------------------------------------------------------
       7️⃣ Transaction: create booking + update availability
    ------------------------------------------------------- */
    try {
      const booking = await this.prisma.$transaction(async (tx) => {
        const createdBooking = await tx.booking.create({
          data: {
            ...createBooking,
            travelDate,
          },
        });

        await tx.tripAvailability.update({
          where: { id: availability.id },
          data: {
            bookedCount: {
              increment: requestedSeats,
            },
          },
        });

        return createdBooking;
      });

      this.logger.log(`Booking created successfully: ${booking.id}`);
      return booking;
    } catch (error) {
      this.logger.error(
        `Booking creation failed: ${error.message}`,
        error.stack,
      );

      if (error.code === 'P2002') {
        throw new ConflictException('Duplicate booking detected.');
      }

      throw new BadRequestException(
        'Failed to create booking due to database error.',
      );
    }
  }
}
