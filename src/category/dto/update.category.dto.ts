import { CreateCategoryDto } from "./create-category.dto";
import { OmitType } from "@nestjs/mapped-types";

export class UpdateCategoryDto extends OmitType(CreateCategoryDto, ['places'] as const) {}
