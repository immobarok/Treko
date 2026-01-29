import {
  Injectable,
  OnModuleInit,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as Minio from 'minio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioService implements OnModuleInit {
  private minioClient: Minio.Client;
  private readonly bucketName: string;
  private readonly logger = new Logger(MinioService.name);

  constructor(private configService: ConfigService) {
    const endPoint = this.configService.get<string>('MINIO_ENDPOINT');
    const accessKey = this.configService.get<string>('MINIO_ACCESS_KEY');
    const secretKey = this.configService.get<string>('MINIO_SECRET_KEY');
    const port = parseInt(this.configService.get<string>('MINIO_PORT', '9000'));

    if (!endPoint || !accessKey || !secretKey) {
      throw new Error('MinIO configuration is missing in .env file');
    }

    this.minioClient = new Minio.Client({
      endPoint,
      port,
      useSSL: false,
      accessKey,
      secretKey,
    });

    this.bucketName = this.configService.get<string>(
      'MINIO_BUCKET_NAME',
      'travel-bucket',
    );
  }

  async onModuleInit() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');

        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${this.bucketName}/*`],
            },
          ],
        };
        await this.minioClient.setBucketPolicy(
          this.bucketName,
          JSON.stringify(policy),
        );
        this.logger.log(`Bucket "${this.bucketName}" created and policy set.`);
      }
    } catch (error) {
      this.logger.error('MinIO Bucket Initialization failed', error.stack);
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const timestamp = Date.now();
    const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '-');
    const fileName = `${timestamp}-${sanitizedFileName}`;

    try {
      await this.minioClient.putObject(
        this.bucketName,
        fileName,
        file.buffer,
        file.size,
        { 'Content-Type': file.mimetype },
      );

      const endPoint = this.configService.get<string>('MINIO_ENDPOINT');
      const port = this.configService.get<string>('MINIO_PORT');

      return `http://${endPoint}:${port}/${this.bucketName}/${fileName}`;
    } catch (error) {
      this.logger.error('File upload to MinIO failed', error.stack);
      throw new InternalServerErrorException('File upload failed');
    }
  }
}
