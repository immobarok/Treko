import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TourType, TripLabel } from 'src/generated/prisma/enums';

class ItineraryDto {
  @IsNumber()
  @IsNotEmpty()
  dayNumber: number;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}

class AvailabilityDto {
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;

  @IsNumber()
  @IsNotEmpty()
  maxTravelers: number;

  @IsNumber()
  @IsNotEmpty()
  adultPrice: number;

  @IsNumber()
  @IsNotEmpty()
  childPrice: number;
}

export class CreateTripDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsEnum(TourType)
  @IsNotEmpty()
  tour_type: TourType;

  @IsOptional()
  @IsEnum(TripLabel)
  label?: TripLabel;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsOptional()
  @IsNumber()
  discount_price?: number;

  @IsOptional()
  @IsNumber()
  discount_percent?: number;

  @IsString()
  @IsNotEmpty()
  accommodation: string;

  @IsString()
  @IsNotEmpty()
  meals: string;

  @IsString()
  @IsNotEmpty()
  transportation: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  group_size: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  age_range: string;

  @IsString()
  @IsNotEmpty()
  season: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItineraryDto)
  @IsOptional()
  itineraries: ItineraryDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilityDto)
  @IsOptional()
  availabilities: AvailabilityDto[];
}
