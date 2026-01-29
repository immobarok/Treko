import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TripEntity } from './entities/trip.entity';
import { PrismaService } from 'src/common/context/prisma.service';

@Injectable()
export class TripsService {
  private readonly logger = new Logger(TripsService.name);

  constructor(private prisma: PrismaService) {}
  async createTrip(cerateTripDto: CreateTripDto): Promise<TripEntity> {
    try {
      const { imageUrls, itineraries, availabilities, ...tripDetails } =
        cerateTripDto;

      const result = await this.prisma.$transaction(async (tx) => {
        return await tx.trip.create({
          data: {
            ...tripDetails,
            images: imageUrls?.length
              ? {
                  create: imageUrls.map((url) => ({ url })),
                }
              : undefined,
            itineraries: itineraries?.length
              ? {
                  create: itineraries,
                }
              : undefined,
            availabilities: availabilities?.length
              ? {
                  create: availabilities,
                }
              : undefined,
          },
          include: {
            images: true,
            itineraries: true,
            availabilities: true,
          },
        });
      });

      return new TripEntity(result);
    } catch (error) {
      this.logger.error(`Failed to create trip: ${error.message}`);
      throw new InternalServerErrorException('Could not create trip');
    }
  }

  async findAll() {
    try {
      // Using 'select' to perform data projection for better performance
      const trips = await this.prisma.trip.findMany({
        select: {
          id: true, // Unique identifier
          name: true, // Name of the trip
          location: true, // Geographical location
          price: true, // Trip cost (Decimal)
          duration: true, // e.g., "3 Days 2 Nights"
          label: true, // e.g., "FEATURED", "DISCOUNT"
          // rating: true,    // Uncomment if rating field exists in your schema
          images: {
            // Fetching all associated images
            select: {
              id: true,
              url: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc', // Show newest trips first (Industrial Standard)
        },
      });

      return trips;
    } catch (error) {
      this.logger.error(`Failed to fetch trips: ${error.message}`);
      throw new InternalServerErrorException('Could not retrieve trip data.');
    }
  }
  async findOne(id: string): Promise<TripEntity> {
    const trip = await this.prisma.trip.findUnique({
      where: { id },
      include: {
        images: true,
        itineraries: true,
        availabilities: true,
      },
    });

    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }

    return new TripEntity(trip);
  }

  /**
   * 4. Update trip (Returns TripEntity)
   */
  async updateTrip(
    id: string,
    cerateTripDto: UpdateTripDto,
  ): Promise<TripEntity> {
    // First ensure that the trip exists
    await this.findOne(id);

    try {
      const { imageUrls, itineraries, availabilities, ...tripDetails } =
        cerateTripDto;

      const updatedTrip = await this.prisma.$transaction(async (tx) => {
        // If images or itineraries are provided, delete old ones and set new ones (Industrial Standard)
        if (imageUrls) await tx.tripImage.deleteMany({ where: { tripId: id } });
        if (itineraries)
          await tx.itinerary.deleteMany({ where: { tripId: id } });
        if (availabilities)
          await tx.tripAvailability.deleteMany({ where: { tripId: id } });

        return await tx.trip.update({
          where: { id },
          data: {
            ...tripDetails,
            images: imageUrls
              ? { create: imageUrls.map((url) => ({ url })) }
              : undefined,
            itineraries: itineraries ? { create: itineraries } : undefined,
            availabilities: availabilities
              ? { create: availabilities }
              : undefined,
          },
          include: {
            images: true,
            itineraries: true,
            availabilities: true,
          },
        });
      });

      return new TripEntity(updatedTrip);
    } catch (error) {
      this.logger.error(`Update failed for trip ${id}: ${error.message}`);
      throw new InternalServerErrorException('Update failed');
    }
  }

  async deleteTrip(id: string): Promise<{ message: string }> {
    await this.findOne(id);

    try {
      await this.prisma.trip.delete({ where: { id } });
      return { message: 'Trip deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Delete operation failed');
    }
  }
}
