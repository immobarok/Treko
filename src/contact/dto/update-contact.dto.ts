import { PartialType } from "@nestjs/mapped-types";
import { CreateContactInfoDto } from './create-contactinfo.dto';

export class UpdateContactInfoDto extends PartialType(CreateContactInfoDto) {}