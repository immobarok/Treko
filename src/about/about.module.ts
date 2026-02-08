import { Module } from '@nestjs/common';
import { AboutController } from './about.controller';
import { AboutService } from './about.service';
import { MinioModule } from 'src/common/minio/minio.module';

@Module({
  imports: [MinioModule],
  controllers: [AboutController],
  providers: [AboutService],
})
export class AboutModule {}
