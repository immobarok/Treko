import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsInt,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePlaceDto } from './create-place.dto';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Bangladesh

  @IsString()
  @IsNotEmpty()
  slug: string; // bangladesh

  @IsUrl()
  @IsOptional()
  image?: string;
  @IsInt()
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePlaceDto)
  @IsOptional()
  places?: CreatePlaceDto[];
}
