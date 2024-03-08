import {
  Controller,
  UseGuards,
  Req,
  Get,
  Query,
  ParseIntPipe,
  Param,
  ForbiddenException,
  ParseEnumPipe,
  NotFoundException,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ObjectIdValidationPipe } from 'src/common';
import { ControllerResponse, Order, Request, UrlSortOption } from 'src/constants/types';

import { OrganizationsService } from './organizations.service';
import { CategoriesService } from '../categories/categories.service';
import { AddUrlToCategoriesDto } from '../categories/dto/add-url-to-categories.dto';
import { UpdateCategoryDto } from '../categories/dto/update-category.dto';
import { Category } from '../categories/schemas/category.schema';
import { AuthGuard } from '../common/guards/auth.guard';
import { Url } from '../urls/schemas/url.schema';
import { UrlsService } from '../urls/urls.service';

@ApiTags('organizations')
@UseGuards(AuthGuard)
@Controller()
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly urlsService: UrlsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get(':id/urls')
  public async getUrls(
    @Req() req: Request,
    @Param('id', ObjectIdValidationPipe) id: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('sort', new ParseEnumPipe(UrlSortOption)) sort: UrlSortOption,
    @Query('order', new ParseEnumPipe(Order)) order: Order,
  ): Promise<ControllerResponse<{ urls: Url[]; size: number; totalPages: number; totalUrls: number }>> {
    const { userId } = req.tokenMeta;

    if (!(await this.organizationsService.isManager(userId.toString(), id))) {
      throw new ForbiddenException('You are not allowed');
    }

    const urls = await this.urlsService.getUrlsByOrganizationId(id, sort, order, page, limit);
    const { totalPages, totalUrls } = await this.urlsService.getTotalPagesAndUrls(id, limit);

    return { payload: { urls, size: urls.length, totalPages, totalUrls } };
  }

  @Get(':id/urls/search')
  public async searchUrls(
    @Req() req: Request,
    @Param('id', ObjectIdValidationPipe) id: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('sort', new ParseEnumPipe(UrlSortOption)) sort: UrlSortOption,
    @Query('order', new ParseEnumPipe(Order)) order: Order,
    @Query('q') q: string,
  ): Promise<ControllerResponse<{ urls: Url[]; size: number; totalPages: number; totalUrls: number }>> {
    const { userId } = req.tokenMeta;

    if (!(await this.organizationsService.isManager(userId.toString(), id))) {
      throw new ForbiddenException('You are not allowed');
    }

    const urls = await this.urlsService.searchUrlsByOrganizationId(id, sort, order, q, page, limit);
    const { totalPages, totalUrls } = await this.urlsService.getTotalPagesAndUrls(id, limit, q);

    return { payload: { urls, size: urls.length, totalPages, totalUrls } };
  }

  @Get(':id/categories')
  public async getCategories(
    @Req() req: Request,
    @Param('id', ObjectIdValidationPipe) id: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<ControllerResponse<{ categories: Category[]; size: number; totalPages: number }>> {
    const { userId } = req.tokenMeta;

    if (!(await this.organizationsService.isManager(userId.toString(), id))) {
      throw new ForbiddenException('You are not allowed');
    }

    const categories = await this.categoriesService.getCategoriesByOrganizationId(id, page, limit);

    const totalPages = await this.categoriesService.getTotalPages(id, limit);

    return { payload: { size: categories.length, totalPages, categories } };
  }

  @Get(':id/categories/search')
  public async searchCategories(
    @Req() req: Request,
    @Param('id', ObjectIdValidationPipe) id: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('q') q: string,
  ): Promise<ControllerResponse<{ categories: Category[]; size: number; totalPages: number }>> {
    const { userId } = req.tokenMeta;

    if (!(await this.organizationsService.isManager(userId.toString(), id))) {
      throw new ForbiddenException('You are not allowed');
    }

    const categories = await this.categoriesService.searchCategoriesByOrganizationId(id, q, page, limit);
    const totalPages = await this.categoriesService.getTotalPages(id, limit, q);

    return { payload: { size: categories.length, totalPages, categories } };
  }

  @Get(':id/categories/:categoryId')
  public async getCategoryById(
    @Req() req: Request,
    @Param('id', ObjectIdValidationPipe) id: string,
    @Param('categoryId', ObjectIdValidationPipe) categoryId: string,
  ): Promise<ControllerResponse<Category>> {
    const { userId } = req.tokenMeta;

    if (!(await this.organizationsService.isManager(userId.toString(), id))) {
      throw new ForbiddenException('You are not allowed');
    }

    const category = await this.categoriesService.getCategoryById(id, categoryId);
    if (!category) {
      throw new NotFoundException('Not found');
    }

    return { payload: category };
  }

  @Patch(':id/categories/add-url')
  public async addUrlToCategories(
    @Req() req: Request,
    @Body() dto: AddUrlToCategoriesDto,
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<ControllerResponse<boolean>> {
    const { userId } = req.tokenMeta;
    dto.updatedBy = userId;
    if (!(await this.organizationsService.isManager(userId.toString(), id))) {
      throw new ForbiddenException('You are not allowed');
    }

    return { payload: await this.categoriesService.addUrlToCategories(id, dto) };
  }

  @Patch(':id/categories/:categoryId')
  public async updateCategoryById(
    @Req() req: Request,
    @Body() dto: UpdateCategoryDto,
    @Param('id', ObjectIdValidationPipe) id: string,
    @Param('categoryId', ObjectIdValidationPipe) categoryId: string,
  ): Promise<ControllerResponse<Category>> {
    const { userId } = req.tokenMeta;
    dto.updatedBy = userId;
    if (!(await this.organizationsService.isManager(userId.toString(), id))) {
      throw new ForbiddenException('You are not allowed');
    }

    const category = await this.categoriesService.updateCategoryById(id, categoryId, dto);
    if (!category) {
      throw new NotFoundException('Not found');
    }

    return { payload: category };
  }

  @Delete(':id/categories/:categoryId')
  public async deleteCategoryById(
    @Req() req: Request,
    @Param('id', ObjectIdValidationPipe) id: string,
    @Param('categoryId', ObjectIdValidationPipe) categoryId: string,
  ): Promise<ControllerResponse<Category | null>> {
    const { userId } = req.tokenMeta;

    if (!(await this.organizationsService.isManager(userId.toString(), id))) {
      throw new ForbiddenException('You are not allowed');
    }

    const category = await this.categoriesService.deleteCategoryById(id, categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return { payload: category };
  }
}
