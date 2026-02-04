import {
  IsString,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  IsDateString,
  IsInt,
  IsPositive,
  Min,
  IsNumber,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { BookingStatus, PaymentMethod } from 'src/generated/prisma/enums';

export class CreateBookingDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @IsDateString() // Accepts ISO date strings; transform to Date if needed in service
  @IsNotEmpty()
  travelDate: string;

  @IsInt()
  @IsPositive()
  @Min(1)
  adults: number;

  @IsInt()
  @Min(0)
  children: number;

  @IsNumber({ maxDecimalPlaces: 2 }) // For decimal validation
  @IsPositive()
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value)) // Transform string to number
  subtotal: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  totalPrice: number;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @IsString()
  @IsOptional()
  orderNote?: string;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsUUID()
  @IsNotEmpty()
  tripId: string;
}
