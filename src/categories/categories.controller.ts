import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerResponse, Request } from 'src/constants/types';
import { injectUserId } from 'src/utils';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './schemas/category.schema';
import { AuthGuard } from '../common/guards/auth.guard';

@ApiTags('categories')
@UseGuards(AuthGuard)
@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  public async create(@Req() req: Request, @Body() dto: CreateCategoryDto): Promise<ControllerResponse<Category>> {
    injectUserId(dto, req.tokenMeta.userId);

    return { payload: await this.categoriesService.create(dto) };
  }
}
