import { PartialType } from "@nestjs/mapped-types";
import { CreateLandingPageDto } from "./create.about.dto";

export class UpdateAboutDto extends PartialType(CreateLandingPageDto) {}