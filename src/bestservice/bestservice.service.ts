import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/context/prisma.service';
import { UpdateServiceFeatureDto } from './dto/update-service-feature.dto';
import { CreateBestServiceDto } from './dto/create-service-feature.dto';
import { MinioService } from 'src/common/minio/minio.service';

@Injectable()
export class BestserviceService {
  private readonly logger = new Logger(BestserviceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly minioService: MinioService,
  ) {}

  async uploadIcon(file: Express.Multer.File) {
    try {
      const url = await this.minioService.uploadFile(file);
      return { url };
    } catch (error) {
      this.logger.error('Failed to upload icon', error);
      throw error;
    }
  }

  async createBestService(
    dto: CreateBestServiceDto,
    files?: Express.Multer.File[],
  ) {
    try {
      const featuresWithIcons = await Promise.all(
        dto.features.map(async (f, index) => {
          let iconUrl = f.icon;

          // Check if there's a file for this specific feature's icon
          // Example fieldname: features[0][icon]
          const specificFile = files?.find(
            (file) => file.fieldname === `features[${index}][icon]`,
          );

          if (specificFile) {
            iconUrl = await this.minioService.uploadFile(specificFile);
          } else {
            // Fallback to a global 'icon' field if specific one is not provided
            const globalIconFile = files?.find(
              (file) => file.fieldname === 'icon',
            );
            if (globalIconFile) {
              iconUrl = await this.minioService.uploadFile(globalIconFile);
            }
          }

          return {
            title: f.title,
            description: f.description,
            icon: iconUrl || '',
            order: f.order ?? index,
            isActive: f.isActive ?? true,
          };
        }),
      );

      return await this.prisma.serviceSection.create({
        data: {
          heading: dto.heading,
          subHeading: dto.subHeading,
          isActive: dto.isActive ?? true,
          features: {
            create: featuresWithIcons,
          },
        },
      });
    } catch (error) {
      this.logger.error('Failed to create best service', error);
      throw error;
    }
  }

  async getBestServices() {
    try {
      return await this.prisma.serviceSection.findFirst({
        where: { isActive: true },
        include: {
          features: {
            where: { isActive: true },
            orderBy: { order: 'asc' },
          },
        },
      });
    } catch (error) {
      this.logger.error('Failed to get best services', error);
      throw error;
    }
  }

  async getBestServiceById(id: string) {
    try {
      return await this.prisma.serviceSection.findUnique({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Failed to get best service: ${id}`, error);
      throw error;
    }
  }

  async updateBestService(id: string, data: UpdateServiceFeatureDto) {
    try {
      const section = await this.prisma.serviceSection.findUnique({
        where: { id },
      });

      if (!section) {
        throw new NotFoundException('Best service not found');
      }

      return await this.prisma.serviceSection.update({
        where: { id },
        data: {
          heading: data.heading,
          subHeading: data.subHeading,
          isActive: data.isActive,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to update best service: ${id}`, error);
      throw error;
    }
  }

  async deleteBestService(id: string) {
    try {
      return await this.prisma.serviceSection.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Failed to delete best service: ${id}`, error);
      throw error;
    }
  }

  async toggleBestService(id: string, isActive: boolean) {
    try {
      return await this.prisma.serviceSection.update({
        where: { id },
        data: { isActive },
      });
    } catch (error) {
      this.logger.error(`Failed to toggle best service: ${id}`, error);
      throw error;
    }
  }
}
