import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  //Ensure ConfigModule.forRoot({ isGlobal: true }) is in AppModule, otherwise you must import ConfigModule directly into MinioModule to resolve the ConfigService dependency.
  imports: [ConfigModule.forRoot()],
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}
