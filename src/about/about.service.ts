import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/context/prisma.service';
import { AboutSectionDto, BestServicesDto, CreateLandingPageDto, JourneyTimelineDto, PartnerDto, VideoSectionDto, WhyChooseUsDto } from './dto/create.about.dto';
import { MinioService } from 'src/common/minio/minio.service';

@Injectable()
export class AboutService {
  private readonly logger = new Logger(AboutService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly minioService: MinioService,
  ) {}

  private async ensureLandingPage() {
    let lp = await this.prisma.landingPage.findFirst();
    if (!lp) {
      lp = await this.prisma.landingPage.create({ data: {} });
    }
    return lp;
  }

  async uploadFile(file: Express.Multer.File) {
    try {
      const url = await this.minioService.uploadFile(file);
      return { url };
    } catch (error) {
      this.logger.error('Failed to upload file', error);
      throw error;
    }
  }

  async upsertAboutSection(
    data: AboutSectionDto,
    files?: Express.Multer.File[],
  ) {
    try {
      const lp = await this.ensureLandingPage();
      const getFileUrl = async (fieldname: string, fallback?: string) => {
        const file = files?.find((f) => f.fieldname === fieldname);
        return file ? await this.minioService.uploadFile(file) : fallback || '';
      };

      const aboutSectionImages: string[] = [];
      if (files) {
        let idx = 0;
        while (true) {
          const url = await getFileUrl(`images[${idx}]`);
          if (url) {
            aboutSectionImages.push(url);
            idx++;
          } else {
            break;
          }
        }
      }

      const finalImages =
        aboutSectionImages.length > 0 ? aboutSectionImages : data.images || [];

      return await this.prisma.aboutSection.upsert({
        where: { landingPageId: lp.id },
        update: {
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          founderName: data.founder.name,
          founderRole: data.founder.designation,
          signatureUrl: await getFileUrl(
            'founder[signature_url]',
            data.founder.signature_url,
          ),
          images: finalImages,
        },
        create: {
          landingPageId: lp.id,
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          founderName: data.founder.name,
          founderRole: data.founder.designation,
          signatureUrl: await getFileUrl(
            'founder[signature_url]',
            data.founder.signature_url,
          ),
          images: finalImages,
        },
      });
    } catch (error: any) {
      this.logger.error(`Failed to upsert about section: ${error.message}`);
      throw new InternalServerErrorException('Could not save about section');
    }
  }

  async upsertBestServices(
    data: BestServicesDto,
    files?: Express.Multer.File[],
  ) {
    try {
      const lp = await this.ensureLandingPage();
      const getFileUrl = async (fieldname: string, fallback?: string) => {
        const file = files?.find((f) => f.fieldname === fieldname);
        return file ? await this.minioService.uploadFile(file) : fallback || '';
      };

      const promoBanner = await getFileUrl('promo_banner', data.promo_banner);

      return await this.prisma.bestServices.upsert({
        where: { landingPageId: lp.id },
        update: {
          title: data.title,
          promoBanner,
          items: {
            deleteMany: {},
            create: await Promise.all(
              data.items.map(async (item, i) => ({
                icon: await getFileUrl(`items[${i}][icon]`, item.icon),
                label: item.label,
                desc: item.desc,
              })),
            ),
          },
        },
        create: {
          landingPageId: lp.id,
          title: data.title,
          promoBanner,
          items: {
            create: await Promise.all(
              data.items.map(async (item, i) => ({
                icon: await getFileUrl(`items[${i}][icon]`, item.icon),
                label: item.label,
                desc: item.desc,
              })),
            ),
          },
        },
      });
    } catch (error: any) {
      this.logger.error(`Failed to upsert best services: ${error.message}`);
      throw new InternalServerErrorException('Could not save best services');
    }
  }

  async upsertJourneyTimeline(
    data: JourneyTimelineDto,
    files?: Express.Multer.File[],
  ) {
    try {
      const lp = await this.ensureLandingPage();
      const getFileUrl = async (fieldname: string, fallback?: string) => {
        const file = files?.find((f) => f.fieldname === fieldname);
        return file ? await this.minioService.uploadFile(file) : fallback || '';
      };

      return await this.prisma.journeyTimeline.upsert({
        where: { landingPageId: lp.id },
        update: {
          title: data.title,
          description: data.description,
          historyTitle: data.history_box.title,
          historyDesc: data.history_box.description,
          events: {
            deleteMany: {},
            create: await Promise.all(
              data.events.map(async (event, i) => ({
                year: event.year,
                image: await getFileUrl(`events[${i}][image]`, event.image),
              })),
            ),
          },
        },
        create: {
          landingPageId: lp.id,
          title: data.title,
          description: data.description,
          historyTitle: data.history_box.title,
          historyDesc: data.history_box.description,
          events: {
            create: await Promise.all(
              data.events.map(async (event, i) => ({
                year: event.year,
                image: await getFileUrl(`events[${i}][image]`, event.image),
              })),
            ),
          },
        },
      });
    } catch (error: any) {
      this.logger.error(`Failed to upsert journey timeline: ${error.message}`);
      throw new InternalServerErrorException('Could not save journey timeline');
    }
  }

  async upsertWhyChooseUs(data: WhyChooseUsDto) {
    try {
      const lp = await this.ensureLandingPage();
      return await this.prisma.whyChooseUs.upsert({
        where: { landingPageId: lp.id },
        update: {
          title: data.title,
          description: data.description,
          features: {
            deleteMany: {},
            create: data.features.map((f) => ({
              title: f.title,
              color: f.color,
            })),
          },
        },
        create: {
          landingPageId: lp.id,
          title: data.title,
          description: data.description,
          features: {
            create: data.features.map((f) => ({
              title: f.title,
              color: f.color,
            })),
          },
        },
      });
    } catch (error: any) {
      this.logger.error(`Failed to upsert why choose us: ${error.message}`);
      throw new InternalServerErrorException('Could not save why choose us');
    }
  }

  async upsertPartners(data: PartnerDto[], files?: Express.Multer.File[]) {
    try {
      const lp = await this.ensureLandingPage();
      const getFileUrl = async (fieldname: string, fallback?: string) => {
        const file = files?.find((f) => f.fieldname === fieldname);
        return file ? await this.minioService.uploadFile(file) : fallback || '';
      };

      // For partners, we replace the whole list
      await this.prisma.partner.deleteMany({ where: { landingPageId: lp.id } });

      return await this.prisma.landingPage.update({
        where: { id: lp.id },
        data: {
          partners: {
            create: await Promise.all(
              data.map(async (p, i) => ({
                name: p.name,
                logo: await getFileUrl(`[${i}][logo]`, p.logo),
              })),
            ),
          },
        },
        include: { partners: true },
      });
    } catch (error: any) {
      this.logger.error(`Failed to upsert partners: ${error.message}`);
      throw new InternalServerErrorException('Could not save partners');
    }
  }

  async upsertVideoSection(
    data: VideoSectionDto,
    files?: Express.Multer.File[],
  ) {
    try {
      const lp = await this.ensureLandingPage();
      const getFileUrl = async (fieldname: string, fallback?: string) => {
        const file = files?.find((f) => f.fieldname === fieldname);
        return file ? await this.minioService.uploadFile(file) : fallback || '';
      };

      return await this.prisma.videoSection.upsert({
        where: { landingPageId: lp.id },
        update: {
          videoUrl: data.video_url,
          thumbnail: await getFileUrl('thumbnail', data.thumbnail),
        },
        create: {
          landingPageId: lp.id,
          videoUrl: data.video_url,
          thumbnail: await getFileUrl('thumbnail', data.thumbnail),
        },
      });
    } catch (error: any) {
      this.logger.error(`Failed to upsert video section: ${error.message}`);
      throw new InternalServerErrorException('Could not save video section');
    }
  }

  async getLandingPage() {
    try {
      return await this.prisma.landingPage.findFirst({
        include: {
          aboutSection: true,
          bestServices: { include: { items: true } },
          journeyTimeline: { include: { events: true } },
          whyChooseUs: { include: { features: true } },
          partners: true,
          videoSection: true,
        },
      });
    } catch (error: any) {
      this.logger.error(`Failed to get landing page: ${error.message}`);
      throw new InternalServerErrorException('Could not retrieve landing page');
    }
  }

  async createLandingPage(
    data: CreateLandingPageDto,
    files?: Express.Multer.File[],
  ) {
    try {
      // Helper to find and upload file by fieldname
      const getFileUrl = async (fieldname: string, fallback?: string) => {
        const file = files?.find((f) => f.fieldname === fieldname);
        if (file) {
          return await this.minioService.uploadFile(file);
        }
        return fallback || '';
      };

      // Handle About Section Images (Array)
      const aboutSectionImages: string[] = [];
      if (files) {
        // Look for fieldnames like about_section[images][0], about_section[images][1]...
        let idx = 0;
        while (true) {
          const url = await getFileUrl(`about_section[images][${idx}]`);
          if (url) {
            aboutSectionImages.push(url);
            idx++;
          } else {
            break;
          }
        }
      }
      // If no files were found by indexed fieldname, check if they sent a flat 'about_section[images]' or fallback
      const finalAboutImages =
        aboutSectionImages.length > 0
          ? aboutSectionImages
          : data.about_section.images || [];

      const landingPage = await this.prisma.landingPage.create({
        data: {
          // Section 1: About
          aboutSection: {
            create: {
              title: data.about_section.title,
              subtitle: data.about_section.subtitle,
              description: data.about_section.description,
              founderName: data.about_section.founder.name,
              founderRole: data.about_section.founder.designation,
              signatureUrl: await getFileUrl(
                'about_section[founder][signature_url]',
                data.about_section.founder.signature_url,
              ),
              images: finalAboutImages,
            },
          },
          // Section 2: Services
          bestServices: {
            create: {
              title: data.best_services.title,
              promoBanner: await getFileUrl(
                'best_services[promo_banner]',
                data.best_services.promo_banner,
              ),
              items: {
                create: await Promise.all(
                  data.best_services.items.map(async (item, i) => ({
                    icon: await getFileUrl(
                      `best_services[items][${i}][icon]`,
                      item.icon,
                    ),
                    label: item.label,
                    desc: item.desc,
                  })),
                ),
              },
            },
          },
          // Section 3: Timeline
          journeyTimeline: {
            create: {
              title: data.journey_timeline.title,
              description: data.journey_timeline.description,
              historyTitle: data.journey_timeline.history_box.title,
              historyDesc: data.journey_timeline.history_box.description,
              events: {
                create: await Promise.all(
                  data.journey_timeline.events.map(async (event, i) => ({
                    year: event.year,
                    image: await getFileUrl(
                      `journey_timeline[events][${i}][image]`,
                      event.image,
                    ),
                  })),
                ),
              },
            },
          },
          // Section 4: Why Choose Us
          whyChooseUs: {
            create: {
              title: data.why_choose_us.title,
              description: data.why_choose_us.description,
              features: {
                create: data.why_choose_us.features.map((f) => ({
                  title: f.title,
                  color: f.color,
                })),
              },
            },
          },
          // Section 5: Partners
          partners: {
            create: await Promise.all(
              data.partners.map(async (p, i) => ({
                name: p.name,
                logo: await getFileUrl(`partners[${i}][logo]`, p.logo),
              })),
            ),
          },
          // Section 6: Video
          videoSection: {
            create: {
              videoUrl: data.video_section.video_url,
              thumbnail: await getFileUrl(
                'video_section[thumbnail]',
                data.video_section.thumbnail,
              ),
            },
          },
        },
        include: {
          aboutSection: true,
          bestServices: { include: { items: true } },
          journeyTimeline: { include: { events: true } },
          whyChooseUs: { include: { features: true } },
          partners: true,
          videoSection: true,
        },
      });

      return {
        success: true,
        message: 'Landing page created successfully',
        data: landingPage,
      };
    } catch (error: string | any) {
      this.logger.error(`Failed to create landing page: ${error.message}`);
      throw new InternalServerErrorException(
        'Could not save landing page data',
      );
    }
  }
}
