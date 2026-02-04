import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { MinioModule } from '../common/minio/minio.module';

@Module({
  imports: [MinioModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
