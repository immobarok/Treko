import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateContactCardDto {
  @IsString()
  title!: string;

  @IsString()
  contact!: string;

  @IsString()
  addressLine1!: string;

  @IsString()
  addressLine2!: string;
}

export class CreateContactInfoDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateContactCardDto)
  offices!: CreateContactCardDto[];
}
