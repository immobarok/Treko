import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
  @IsString()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  phoneNumber!: string;

  @IsString()
  destination!: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsBoolean()
  agreeToPolicy!: boolean;
}
