import { PartialType } from '@nestjs/mapped-types';
import { CreateBestServiceDto } from './create-service-feature.dto';

export class UpdateServiceFeatureDto extends PartialType(
  CreateBestServiceDto,
) {}
