import { TourType, TripLabel } from 'src/generated/prisma/enums';
import { Decimal } from '@prisma/client/runtime/client';
export class TripImageEntity {
  id: string;
  url: string;
  tripId: string;
}

export class ItineraryEntity {
  id: string;
  dayNumber: number;
  location: string;
  title: string;
  description?: string | null;
}

export class TripAvailabilityEntity {
  id: string;
  date: Date;
  maxTravelers: number;
  adultPrice: Decimal;
  childPrice: Decimal;
}

export class TripEntity {
  id: string;
  name: string;
  description: string;
  location: string;
  duration: string;
  tour_type: TourType;
  label?: TripLabel | null;

  price: Decimal;
  discount_price?: Decimal | null;
  discount_percent?: number | null;

  accommodation: string;
  meals: string;
  transportation: string;
  group_size: string;
  language: string;
  age_range: string;
  season: string;
  category: string;

  createdAt: Date;
  updatedAt: Date;

  // relational fields for eager loading
  images?: TripImageEntity[];
  itineraries?: ItineraryEntity[];
  availabilities?: TripAvailabilityEntity[];

  constructor(partial: Partial<TripEntity>) {
    Object.assign(this, partial);
  }
}
