import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BestserviceService } from './bestservice.service';
import { CreateBestServiceDto } from './dto/create-service-feature.dto';
import { UpdateServiceFeatureDto } from './dto/update-service-feature.dto';

@Controller('bestservice')
export class BestserviceController {
  constructor(private readonly bestserviceService: BestserviceService) {}
  @Post('create')
  create(@Body() dto: CreateBestServiceDto) {
    return this.bestserviceService.createBestService(dto);
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
