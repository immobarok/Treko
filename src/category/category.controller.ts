import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update.category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  async createCategory(
    @Body() createCategory: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.categoryService.createCategory(createCategory, file);
  }

  @Get('get-all')
  async getAllCategories() {
    return this.categoryService.findAllCategories();
  }

  @Get('get-by-slug/:slug')
  async findCategoryBySlug(@Param('slug') slug: string) {
    return this.categoryService.findCategoryBySlug(slug);
  }

  @Patch('update/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategory: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, updateCategory);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    // Controller should only pass the ID to the service
    return this.categoryService.delete(id);
  }
}
