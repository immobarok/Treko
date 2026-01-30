import { IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCustomerExperienceDto } from './create-experience.dto';
import { CreateSeasonalInfoDto } from './create-seasonal-info.dto';

export class CreatePlaceDetailsDto {
  @IsOptional()
  popular_places?: any;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCustomerExperienceDto)
  @IsOptional()
  customer_experiences?: CreateCustomerExperienceDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSeasonalInfoDto)
  @IsOptional()
  seasonal_info?: CreateSeasonalInfoDto[];
}
