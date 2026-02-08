import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsUrl,
  IsNumber,
  IsHexColor,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FounderDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  designation!: string;

  @IsOptional()
  @IsUrl()
  signature_url?: string;
}

export class AboutSectionDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  subtitle!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @ValidateNested()
  @Type(() => FounderDto)
  founder: FounderDto = new FounderDto();

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[] = [];
}

export class ServiceItemDto {
  @IsNumber()
  id: number = 0;

  @IsString()
  icon?: string;

  @IsString()
  label!: string;

  @IsString()
  desc!: string;
}

export class BestServicesDto {
  @IsString()
  title!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceItemDto)
  items: ServiceItemDto[] = [];

  @IsOptional()
  @IsString()
  promo_banner?: string;
}

export class TimelineEventDto {
  @IsNumber()
  year: number = 0;

  @IsOptional()
  @IsString()
  image?: string;
}

export class HistoryBoxDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class JourneyTimelineDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimelineEventDto)
  events: TimelineEventDto[] = [];

  @ValidateNested()
  @Type(() => HistoryBoxDto)
  history_box: HistoryBoxDto = new HistoryBoxDto();
}

export class FeatureDto {
  @IsNumber()
  id: number = 0;

  @IsString()
  title!: string;

  @IsHexColor()
  color: string = '#ffffff';
}

export class WhyChooseUsDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureDto)
  features: FeatureDto[] = [];
}

export class PartnerDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  logo?: string;
}

export class VideoSectionDto {
  @IsUrl()
  video_url!: string;

  @IsOptional()
  @IsUrl()
  thumbnail?: string;
}

export class CreateLandingPageDto {
  @ValidateNested()
  @Type(() => AboutSectionDto)
  about_section: AboutSectionDto = new AboutSectionDto();

  @ValidateNested()
  @Type(() => BestServicesDto)
  best_services: BestServicesDto = new BestServicesDto();

  @ValidateNested()
  @Type(() => JourneyTimelineDto)
  journey_timeline: JourneyTimelineDto = new JourneyTimelineDto();

  @ValidateNested()
  @Type(() => WhyChooseUsDto)
  why_choose_us: WhyChooseUsDto = new WhyChooseUsDto();

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PartnerDto)
  partners: PartnerDto[] = [];

  @ValidateNested()
  @Type(() => VideoSectionDto)
  video_section: VideoSectionDto = new VideoSectionDto();
}
