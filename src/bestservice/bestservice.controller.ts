import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BestserviceService } from './bestservice.service';

@Controller('bestservice')
export class BestserviceController {
  constructor(private readonly bestserviceService: BestserviceService) {}
  
}
