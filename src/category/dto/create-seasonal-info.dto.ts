// src/modules/categories/dto/create-seasonal-info.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsArray,
  IsInt,
} from 'class-validator';

export class CreateSeasonalInfoDto {
  @IsString()
  @IsNotEmpty()
  season: string; // "Spring (March-May)"

  @IsString()
  @IsNotEmpty()
  weather_celsius: string; // "12-20°C"

  @IsString()
  @IsNotEmpty()
  weather_fahrenheit: string;

  @IsArray()
  @IsString({ each: true })
  highlights: string[];

  @IsArray()
  @IsString({ each: true })
  perfect_for: string[];

  @IsUrl()
  @IsOptional()
  image?: string;

  @IsInt()
  @IsOptional()
  order?: number;
}
