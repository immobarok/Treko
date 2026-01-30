import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsNotEmpty,
  IsBoolean,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TourType, TripLabel } from 'src/generated/prisma/enums';

/**
 * DTO for nested Highlights
 */
class HighlightDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}

/**
 * DTO for nested Package Features (Includes/Excludes)
 */
class PackageFeatureDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsBoolean()
  @IsNotEmpty()
  isInclude: boolean;
}

/**
 * DTO for nested FAQs
 */
class FaqDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer: string;
}

/**
 * DTO for nested Additional Services
 */
class AdditionalServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  unit: string;
}

/**
 * DTO for nested Itineraries
 */
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

/**
 * DTO for nested Availability
 */
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

  // --- Pricing Fields ---
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsOptional()
  @IsNumber()
  discount_price?: number;

  @IsOptional()
  @IsNumber()
  discount_percent?: number;

  // --- Tour Details ---
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

  @IsString()
  @IsNotEmpty()
  category: string;

  // --- Additional Info ---
  @IsOptional()
  @IsString()
  @IsUrl() // Ensures the brochure link is a valid URL
  brochure_url?: string;

  @IsOptional()
  @IsString()
  additional_info?: string;

  // --- Nested Relational Data ---
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HighlightDto)
  @IsOptional()
  highlights: HighlightDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItineraryDto)
  @IsOptional()
  itineraries: ItineraryDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageFeatureDto)
  @IsOptional()
  features: PackageFeatureDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FaqDto)
  @IsOptional()
  faqs: FaqDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilityDto)
  @IsOptional()
  availabilities: AvailabilityDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdditionalServiceDto)
  @IsOptional()
  additionalServices: AdditionalServiceDto[];
}
