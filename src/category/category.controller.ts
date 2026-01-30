import { Body, Controller, Post } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  createCategory(@Body() rawDto: any) {
    // Directly seeing the raw row in the controller
    console.log('Controller received:', rawDto);
    return this.categoryService.createCategory(rawDto);
  }
}
