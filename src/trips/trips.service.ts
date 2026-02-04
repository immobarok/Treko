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

  /**
   * 1. Create a Trip with all nested relational data
   */
  async createTrip(createTripDto: CreateTripDto): Promise<TripEntity> {
    try {
      const {
        imageUrls,
        itineraries,
        availabilities,
        highlights,
        features,
        faqs,
        additionalServices,
        ...tripDetails
      } = createTripDto;

      const result = await this.prisma.$transaction(async (tx) => {
        return await tx.trip.create({
          data: {
            ...tripDetails,
            // Create nested images from the provided URL array
            images: imageUrls?.length
              ? { create: imageUrls.map((url) => ({ url })) }
              : undefined,
            // Map and create other nested relations
            itineraries: itineraries?.length
              ? { create: itineraries }
              : undefined,
            availabilities: availabilities?.length
              ? { create: availabilities }
              : undefined,
            highlights: highlights?.length ? { create: highlights } : undefined,
            features: features?.length ? { create: features } : undefined,
            faqs: faqs?.length ? { create: faqs } : undefined,
            additionalServices: additionalServices?.length
              ? { create: additionalServices }
              : undefined,
          },
          include: {
            images: true,
            itineraries: true,
            availabilities: true,
            highlights: true,
            features: true,
            faqs: true,
            additionalServices: true,
          },
        });
      });

      return new TripEntity(result);
    } catch (error) {
      this.logger.error(`Failed to create trip: ${error.message}`);
      throw new InternalServerErrorException('Could not create trip');
    }
  }

  /**
   * 2. Find All Trips (Data Projection for performance)
   */
  async findAll(searchTerm?: string, location?: string) {
    try {
      // Console log diye check korun params thikmoto pouchachche kina
      console.log('Search Params in Service:', { searchTerm, location });

      return await this.prisma.trip.findMany({
        where: {
          AND: [
            searchTerm
              ? {
                  name: {
                    contains: searchTerm,
                    mode: 'insensitive',
                  },
                }
              : {},
            location
              ? {
                  location: {
                    contains: location,
                    mode: 'insensitive',
                  },
                }
              : {},
          ],
        },
        select: {
          id: true,
          name: true,
          location: true,
          price: true,
          duration: true,
          label: true,
          category: true,
          images: {
            select: { id: true, url: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.logger.error(`Failed to fetch trips: ${error.message}`);
      throw new InternalServerErrorException('Could not retrieve trip data.');
    }
  }

  /**
   * 3. Find One Trip by ID (Includes all relations)
   */
  async findOne(id: string): Promise<TripEntity> {
    const trip = await this.prisma.trip.findUnique({
      where: { id },
      include: {
        images: true,
        itineraries: true,
        availabilities: true,
        highlights: true,
        features: true,
        faqs: true,
        additionalServices: true,
      },
    });

    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }

    return new TripEntity(trip);
  }

  /**
   * 4. Update Trip (Deletes old nested records and creates new ones)
   */
  async updateTrip(
    id: string,
    updateTripDto: UpdateTripDto, // Ensure naming is consistent
  ): Promise<TripEntity> {
    // 1. Ensure the trip exists
    await this.findOne(id);

    // console.log('1. Controller received ID:', id);
    // console.log(
    //   '2. Controller received Body:',
    //   JSON.stringify(updateTripDto, null, 2),
    // );

    try {
      // 2. Destructure EVERYTHING properly
      // We separate arrays (relations) from the main trip object (tripDetails)
      const {
        imageUrls,
        itineraries,
        availabilities,
        highlights,
        features,
        faqs,
        additionalServices,
        ...tripDetails // This MUST contain name, price, description, etc.
      } = updateTripDto;

      const updatedTrip = await this.prisma.$transaction(async (tx) => {
        // 3. Handle Relational Updates
        // We only delete/recreate if the user actually provided them (not undefined)
        if (imageUrls !== undefined) {
          await tx.tripImage.deleteMany({ where: { tripId: id } });
          await tx.tripImage.createMany({
            data: imageUrls.map((url) => ({ url, tripId: id })),
          });
        }

        if (itineraries !== undefined) {
          await tx.itinerary.deleteMany({ where: { tripId: id } });
          await tx.itinerary.createMany({
            data: itineraries.map((item) => ({ ...item, tripId: id })),
          });
        }

        // 4. Update the main Trip record
        // This is the part that updates 'name', 'price', 'location', etc.
        return await tx.trip.update({
          where: { id },
          data: tripDetails, // This object must NOT be empty
          include: {
            images: true,
            itineraries: true,
            availabilities: true,
            highlights: true,
            features: true,
            faqs: true,
            additionalServices: true,
          },
        });
      });

      return new TripEntity(updatedTrip);
    } catch (error) {
      this.logger.error(`Update failed for trip ${id}: ${error.message}`);
      throw new InternalServerErrorException(
        'Update failed - check database constraints',
      );
    }
  }

  /**
   * 5. Delete Trip
   */
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
