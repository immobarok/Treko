import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateCustomerExperienceDto {
  @IsString()
  @IsOptional()
  customerName?: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsOptional()
  rating?: number;
}
