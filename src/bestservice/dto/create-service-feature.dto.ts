import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateFeatureDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  order?: number;

  @IsOptional()
  isActive?: boolean;
}

export class CreateBestServiceDto {
  @IsString()
  heading!: string;

  @IsOptional()
  @IsString()
  subHeading?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFeatureDto)
  features!: CreateFeatureDto[];
}
