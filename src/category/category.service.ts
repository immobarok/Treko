import {
  Injectable,
  Logger,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/context/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update.category.dto';
import { MinioService } from 'src/common/minio/minio.service';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    private prisma: PrismaService,
    private minioService: MinioService,
  ) {}

  async createCategory(
    createCategory: CreateCategoryDto,
    file: Express.Multer.File,
  ) {
    const { name, slug, order, isActive, places } = createCategory;

    // 1. Check for duplicates
    const existing = await this.prisma.category.findFirst({
      where: { OR: [{ name }, { slug }] },
    });
    if (existing)
      throw new ConflictException('Category name or slug already exists');

    // 2. Upload to MinIO
    let categoryImageUrl = createCategory.image;
    if (file) {
      categoryImageUrl = await this.minioService.uploadFile(file);
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        return await tx.category.create({
          data: {
            name,
            slug,
            image: categoryImageUrl,
            order,
            isActive,
            places: {
              create: places?.map((place) => ({
                name: place.name,
                slug: place.slug,
                image: place.image,
                bannerImage: place.bannerImage,
                shortDesc: place.shortDesc,
                capital: place.capital,
                currency: place.currency,
                language: place.language,
                timezone: place.timezone,
                visaRequired: place.visaRequired,
                order: place.order,
                isFeatured: place.isFeatured,
                details: place.details
                  ? {
                      create: {
                        popular_places: place.details.popular_places,
                        customer_experiences: {
                          create: place.details.customer_experiences?.map(
                            (exp) => ({
                              customerName: exp.customerName,
                              image: exp.image,
                              description: exp.description,
                              rating: exp.rating,
                            }),
                          ),
                        },
                        seasonal_info: {
                          create: place.details.seasonal_info?.map((info) => ({
                            season: info.season,
                            weather_celsius: info.weather_celsius,
                            weather_fahrenheit: info.weather_fahrenheit,
                            highlights: info.highlights,
                            perfect_for: info.perfect_for,
                            image: info.image,
                            order: info.order,
                          })),
                        },
                      },
                    }
                  : undefined,
              })),
            },
          },
          include: {
            places: {
              include: {
                details: {
                  include: {
                    customer_experiences: true,
                    seasonal_info: true,
                  },
                },
              },
            },
          },
        });
      });
    } catch (error:any) {
      this.logger.error(`Database Error: ${error.message}`);
      throw new InternalServerErrorException('Failed to create category');
    }
  }

  async findAllCategories() {
    return this.prisma.category.findMany({
      include: { _count: { select: { places: true } } },
      orderBy: { order: 'asc' },
    });
  }

  async findCategoryBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        places: {
          include: {
            details: {
              include: {
                customer_experiences: true,
                seasonal_info: true,
              },
            },
          },
        },
      },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async updateCategory(id: string, data: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    return this.prisma.category.update({
      where: { id },
      data: data,
    });
  }

  async delete(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    // 1. Delete from MinIO if image exists
    if (category.image) {
      try {
        await this.minioService.deleteFile(category.image);
      } catch (e) {
        this.logger.warn(`Failed to delete file from MinIO: ${category.image}`);
      }
    }

    // 2. Delete from Database
    return this.prisma.category.delete({ where: { id } });
  }
}
