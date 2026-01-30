import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsOptional,
  IsBoolean,
  IsInt,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePlaceDetailsDto } from './create-place-details.dto';

export class CreatePlaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsUrl()
  @IsOptional()
  bannerImage?: string;

  @IsString()
  @IsOptional()
  shortDesc?: string;

  // Extra metadata fields
  @IsString() @IsOptional() capital?: string;
  @IsString() @IsOptional() currency?: string;
  @IsString() @IsOptional() language?: string;
  @IsString() @IsOptional() timezone?: string;
  @IsBoolean() @IsOptional() visaRequired?: boolean;

  @IsInt()
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ValidateNested()
  @Type(() => CreatePlaceDetailsDto)
  @IsOptional()
  details?: CreatePlaceDetailsDto;
}
