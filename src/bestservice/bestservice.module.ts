import { Module } from '@nestjs/common';
import { BestserviceController } from './bestservice.controller';
import { BestserviceService } from './bestservice.service';
import { MinioModule } from 'src/common/minio/minio.module';

@Module({
  imports: [MinioModule],
  controllers: [BestserviceController],
  providers: [BestserviceService],
})
export class BestserviceModule {}
