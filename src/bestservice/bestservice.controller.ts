import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { BestserviceService } from './bestservice.service';
import { CreateBestServiceDto } from './dto/create-service-feature.dto';
import { UpdateServiceFeatureDto } from './dto/update-service-feature.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('bestservice')
export class BestserviceController {
  constructor(private readonly bestserviceService: BestserviceService) {}

  @Post('upload-icon')
  @UseInterceptors(AnyFilesInterceptor())
  uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    // If you still want the old single upload, you can keep it or use files[0]
    return this.bestserviceService.uploadIcon(files[0]);
  }

  @Post('create')
  @UseInterceptors(AnyFilesInterceptor())
  create(
    @Body() dto: CreateBestServiceDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.bestserviceService.createBestService(dto, files);
  }
  @Get('get-all')
  findAll() {
    return this.bestserviceService.getBestServices();
  }
  @Get('find/:id')
  findOne(@Param('id') id: string) {
    return this.bestserviceService.getBestServiceById(id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateBestServiceDto: UpdateServiceFeatureDto,
  ) {
    return this.bestserviceService.updateBestService(id, updateBestServiceDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.bestserviceService.deleteBestService(id);
  }
}
