import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/context/prisma.service';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(private prisma: PrismaService) {}

  async getAllCatregories() {
    try {
      
    } catch (error) {
      this.logger.error('Failed to get categories', error);
      throw error;
    }
  }
}
