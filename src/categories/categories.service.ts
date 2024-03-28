import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Model,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
  ProjectionType,
  UpdateWriteOpResult,
  SortOrder,
} from 'mongoose';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'src/constants';

import { AddUrlToCategoriesDto } from './dto/add-url-to-categories.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  private readonly logger: Logger = new Logger(CategoriesService.name);

  constructor(@InjectModel(Category.name) private readonly categoryModel: Model<Category>) {}

  public async createCategory(dto: CreateCategoryDto): Promise<Category> {
    return this.create(dto);
  }

  public async getCategoriesByOrganizationId(
    organizationId: string,
    page: number = DEFAULT_PAGE,
    limit: number = DEFAULT_PAGE_SIZE,
  ): Promise<Category[]> {
    return this.find({ organization: organizationId }, (page - 1) * limit, limit);
  }

  public async getCategoryById(organizationId: string, categoryId: string): Promise<Category | null> {
    return this.findOne({ _id: categoryId, organization: organizationId });
  }

  public async searchCategoriesByOrganizationId(
    organizationId: string,
    query: string,
    page: number = DEFAULT_PAGE,
    limit: number = DEFAULT_PAGE_SIZE,
  ): Promise<Category[]> {
    return this.find(
      { $and: [{ organization: organizationId }, { name: { $regex: query } }] },
      (page - 1) * limit,
      limit,
      { updatedAt: -1 },
    );
  }

  public async updateCategoryById(
    organizationId: string,
    categoryId: string,
    dto: UpdateCategoryDto,
  ): Promise<Category | null> {
    const { name, color, updatedBy, urlsToAdd, urlsToRemove } = dto;
    let category = await this.findOneAndUpdate(
      { _id: categoryId, organization: organizationId },
      {
        $set: {
          name,
          color,
          updatedBy,
        },
        $addToSet: { urls: { $each: urlsToAdd } },
      },
      { new: true },
    );
    category = await this.findOneAndUpdate(
      { _id: categoryId, organization: organizationId },
      { $pullAll: { urls: urlsToRemove } },
      { new: true },
    );
    return category;
  }

  public async addUrlToCategories(organizationId: string, dto: AddUrlToCategoriesDto): Promise<boolean> {
    const { categories: categoryIds, updatedBy, url } = dto;
    const query = await this.updateMany(
      { _id: { $in: categoryIds }, organization: organizationId },
      { $addToSet: { urls: url }, $set: { updatedBy } },
    );

    return query.acknowledged;
  }

  public async deleteCategoryById(organizationId: string, categoryId: string): Promise<Category | null> {
    return this.findOneAndDelete({ _id: categoryId, organization: organizationId });
  }

  public async getTotalPages(
    organizationId: string,
    limit: number = DEFAULT_PAGE_SIZE,
    query?: string,
  ): Promise<number> {
    let count = 0;
    if (query) {
      count = await this.categoryModel.countDocuments({
        $and: [{ organization: organizationId }, { name: { $regex: query } }],
      });
    } else {
      count = await this.categoryModel.countDocuments({ organization: organizationId });
    }

    if (count % limit) {
      return Math.ceil(count / limit);
    }
    return count / limit;
  }

  public async create(dto: CreateCategoryDto): Promise<Category> {
    return this.categoryModel.create(dto);
  }

  public async find<T>(
    filter: FilterQuery<CategoryDocument>,
    skip: number = 0,
    limit: number = DEFAULT_PAGE_SIZE,
    sortArg?: Record<string, SortOrder>,
    projection?: ProjectionType<CategoryDocument>,
    options?: QueryOptions<CategoryDocument>,
  ): Promise<T[]> {
    return this.categoryModel
      .find<T>(filter, projection, options)
      .select('name color organization createdBy updatedBy urls')
      .sort(sortArg)
      .skip(skip)
      .limit(limit)
      .populate('urls');
  }

  public async findById(
    id: string,
    projections?: ProjectionType<CategoryDocument>,
    options?: QueryOptions<CategoryDocument>,
  ): Promise<Category | null> {
    return this.categoryModel.findById(id, projections, options);
  }

  public async findOne(
    filter?: FilterQuery<CategoryDocument>,
    projections?: ProjectionType<CategoryDocument>,
    options?: QueryOptions<CategoryDocument>,
  ): Promise<Category | null> {
    return this.categoryModel.findOne(filter, projections, options);
  }

  public async findByIdAndUpdate(
    id?: string,
    update?: UpdateQuery<CategoryDocument>,
    options?: QueryOptions<CategoryDocument>,
  ): Promise<Category | null> {
    return this.categoryModel.findByIdAndUpdate(id, update, options);
  }

  public async findOneAndUpdate(
    filter?: FilterQuery<CategoryDocument>,
    update?: UpdateQuery<CategoryDocument>,
    options?: QueryOptions<CategoryDocument>,
  ): Promise<Category | null> {
    return this.categoryModel.findOneAndUpdate(filter, update, options);
  }

  public async updateMany(
    filter?: FilterQuery<CategoryDocument>,
    update?: UpdateQuery<CategoryDocument>,
  ): Promise<UpdateWriteOpResult> {
    return this.categoryModel.updateMany(filter, update);
  }

  public async findByIdAndDelete(id?: string, options?: QueryOptions<CategoryDocument>): Promise<Category | null> {
    return this.categoryModel.findByIdAndDelete(id, options);
  }

  public async findOneAndDelete(
    filter?: FilterQuery<CategoryDocument>,
    options?: QueryOptions<CategoryDocument>,
  ): Promise<Category | null> {
    return this.categoryModel.findOneAndDelete(filter, options);
  }
}
