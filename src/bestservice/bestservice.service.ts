import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/context/prisma.service';
import { UpdateServiceFeatureDto } from './dto/update-service-feature.dto';
import { CreateBestServiceDto } from './dto/create-service-feature.dto';

@Injectable()
export class BestserviceService {
  private readonly logger = new Logger(BestserviceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createBestService(dto: CreateBestServiceDto) {
    try {
      return await this.prisma.serviceSection.create({
        data: {
          heading: dto.heading,
          subHeading: dto.subHeading,
          isActive: dto.isActive ?? true,
          features: {
            create: dto.features.map((f, index) => ({
              title: f.title,
              description: f.description,
              icon: f.icon,
              order: f.order ?? index,
              isActive: f.isActive ?? true,
            })),
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
