import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AboutService } from './about.service';
import {
  AboutSectionDto,
  BestServicesDto,
  CreateLandingPageDto,
  JourneyTimelineDto,
  PartnerDto,
  VideoSectionDto,
  WhyChooseUsDto,
} from './dto/create.about.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get('landing-page')
  async getLandingPage() {
    return this.aboutService.getLandingPage();
  }

  @Post('section')
  @UseInterceptors(AnyFilesInterceptor())
  async upsertSection(
    @Body() dto: AboutSectionDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.aboutService.upsertAboutSection(dto, files);
  }

  @Post('services')
  @UseInterceptors(AnyFilesInterceptor())
  async upsertServices(
    @Body() dto: BestServicesDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.aboutService.upsertBestServices(dto, files);
  }

  @Post('timeline')
  @UseInterceptors(AnyFilesInterceptor())
  async upsertTimeline(
    @Body() dto: JourneyTimelineDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.aboutService.upsertJourneyTimeline(dto, files);
  }

  @Post('why-choose-us')
  async upsertWhyChooseUs(@Body() dto: WhyChooseUsDto) {
    return this.aboutService.upsertWhyChooseUs(dto);
  }

  @Post('partners')
  @UseInterceptors(AnyFilesInterceptor())
  async upsertPartners(
    @Body() dto: { partners: PartnerDto[] },
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    // Note: PartnerDto[] might need a wrapper if sent as JSON body with files
    const partners = Array.isArray(dto.partners) ? dto.partners : [];
    return this.aboutService.upsertPartners(partners, files);
  }

  @Post('video')
  @UseInterceptors(AnyFilesInterceptor())
  async upsertVideo(
    @Body() dto: VideoSectionDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.aboutService.upsertVideoSection(dto, files);
  }

  @Post('create-landing')
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body() dto: CreateLandingPageDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.aboutService.createLandingPage(dto, files);
  }
}
