import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AggregateOptions,
  FilterQuery,
  Model,
  PipelineStage,
  ProjectionType,
  QueryOptions,
  SortOrder,
  Types,
  UpdateQuery,
} from 'mongoose';
import { customAlphabet } from 'nanoid';
import { ICategoryEntity } from 'src/categories/interfaces';
import { ALPHABET, DEFAULT_DOMAIN, DEFAULT_PAGE, DEFAULT_PAGE_SIZE, SLUG_REGEX } from 'src/constants';
import { Order, UrlSortOption } from 'src/constants/types';
import { getOrigin } from 'src/utils';

import { CreateUrlDto } from './dto/create-url.dto';
import { IUrlEntity } from './interfaces';
import { Url, UrlDocument } from './schemas/url.schema';
import { CategoriesService } from '../categories/categories.service';
import { OrganizationsService } from '../organization/organizations.service';

const nanoid = customAlphabet(ALPHABET, 7);

@Injectable()
export class UrlsService {
  // private readonly logger: Logger = new Logger(UrlsService.name);

  constructor(
    @InjectModel(Url.name) private readonly urlModel: Model<Url>,
    private readonly organizationsService: OrganizationsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  public async create(dto: CreateUrlDto): Promise<Url> {
    const { originalUrl, slug, domain = DEFAULT_DOMAIN, organizationId, createdBy, updatedBy } = dto;

    // TODO: cache domain -> organization -> managers
    if (!(await this.organizationsService.isAllowedToUseDomain(organizationId, createdBy.toString(), domain))) {
      throw new BadRequestException('You are not allowed to use this domain');
    }

    let url = await this.urlModel.findOne({ slug, domain });
    if (url) {
      throw new BadRequestException('Slug with this domain already exists');
    }

    if (slug && !SLUG_REGEX.test(slug)) {
      throw new BadRequestException('Slug is not valid');
    }

    url = await this.urlModel.create({
      originalUrl,
      slug: slug || nanoid(),
      domain,
      organizationId,
      createdBy,
      updatedBy,
    });

    return url;
  }

  public async find(
    filter: FilterQuery<UrlDocument>,
    skip: number = 0,
    limit: number = DEFAULT_PAGE_SIZE,
    sortArg?: Record<string, SortOrder>,
    projection?: ProjectionType<UrlDocument>,
    options?: QueryOptions<UrlDocument>,
  ): Promise<Url[]> {
    return this.urlModel.find(filter, projection, options).sort(sortArg).skip(skip).limit(limit);
  }

  public async findOne(
    filter?: FilterQuery<UrlDocument>,
    projection?: ProjectionType<UrlDocument>,
    options?: QueryOptions<UrlDocument>,
  ): Promise<Url | null> {
    return this.urlModel.findOne(filter, projection, options);
  }

  public async aggregate<T>(pipeline?: PipelineStage[], options?: AggregateOptions): Promise<T[]> {
    return this.urlModel.aggregate<T>(pipeline, options);
  }

  public async getOriginalUrl(slug: string, domain: string, referer: string): Promise<string> {
    const url = await this.urlModel.findOne({ slug, domain });
    if (!url?.isActive) {
      throw new NotFoundException('URL not found!');
    }

    url.totalClicks.push({ clickedAt: new Date(), origin: getOrigin(referer), ip: '' });
    await url.save();
    return url.originalUrl;
  }

  public async getTotalPagesAndUrls(
    organizationId: string,
    limit: number = DEFAULT_PAGE_SIZE,
    query?: string,
  ): Promise<{ totalPages: number; totalUrls: number }> {
    let totalUrls = 0;
    if (query) {
      totalUrls = await this.urlModel.countDocuments({
        organizationId,
        $or: [{ slug: { $regex: query } }, { originalUrl: { $regex: query } }],
      });
    } else {
      totalUrls = await this.urlModel.countDocuments({ organizationId });
    }

    if (totalUrls % limit) {
      return { totalPages: Math.ceil(totalUrls / limit), totalUrls };
    }
    return { totalPages: totalUrls / limit, totalUrls };
  }

  public async getUrlsByOrganizationId(
    organizationId: string,
    sort: UrlSortOption,
    order: Order,
    page: number = DEFAULT_PAGE,
    limit: number = DEFAULT_PAGE_SIZE,
  ): Promise<Url[]> {
    let sortPipeline: PipelineStage | null = null;
    if (sort === UrlSortOption.TIME) {
      sortPipeline = { $sort: { updatedAt: order === Order.ASC ? 1 : -1 } };
    } else {
      sortPipeline = { $sort: { clickCount: order === Order.ASC ? 1 : -1, updatedAt: -1 } };
    }

    const urls = await this.aggregate<IUrlEntity>([
      { $match: { organizationId: new Types.ObjectId(organizationId) } },
      {
        $project: {
          originalUrl: 1,
          slug: 1,
          domain: 1,
          organizationId: 1,
          isActive: 1,
          platform: 1,
          createdAt: 1,
          updatedAt: 1,
          createdBy: 1,
          updatedBy: 1,
          clickCount: { $size: '$totalClicks' },
        },
      },
      sortPipeline,
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    const categories = await this.categoriesService.find<ICategoryEntity>({
      organization: new Types.ObjectId(organizationId),
    });

    for (const url of urls) {
      for (const category of categories) {
        if (category.urls.some(categoryUrl => categoryUrl._id.equals(url._id))) {
          url.categories.push(category);
        }
      }
    }

    return urls;
  }

  public async searchUrlsByOrganizationId(
    organizationId: string,
    sort: UrlSortOption,
    order: Order,
    query: string,
    page: number = DEFAULT_PAGE,
    limit: number = DEFAULT_PAGE_SIZE,
  ): Promise<Url[]> {
    let sortPipeline: PipelineStage | null = null;
    if (sort === UrlSortOption.TIME) {
      sortPipeline = { $sort: { updatedAt: order === Order.ASC ? 1 : -1 } };
    } else {
      sortPipeline = { $sort: { clickCount: order === Order.ASC ? 1 : -1, updatedAt: -1 } };
    }

    const urls = await this.aggregate<IUrlEntity>([
      { $match: { organizationId: new Types.ObjectId(organizationId) } },
      {
        $match: { $or: [{ slug: { $regex: query } }, { originalUrl: { $regex: query } }] },
      },
      {
        $project: {
          _id: 1,
          originalUrl: 1,
          slug: 1,
          domain: 1,
          organizationId: 1,
          isActive: 1,
          platform: 1,
          createdAt: 1,
          updatedAt: 1,
          createdBy: 1,
          updatedBy: 1,
          clickCount: { $size: '$totalClicks' },
        },
      },
      sortPipeline,
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    const categories = await this.categoriesService.find<ICategoryEntity>({
      organization: new Types.ObjectId(organizationId),
    });

    for (const url of urls) {
      for (const category of categories) {
        if (category.urls.some(categoryUrl => categoryUrl._id.equals(url._id))) {
          url.categories.push(category);
        }
      }
    }

    return urls;
  }

  public async findByIdAndUpdate(
    id: Types.ObjectId,
    update?: UpdateQuery<UrlDocument>,
    options?: QueryOptions<UrlDocument>,
  ): Promise<Url | null> {
    return this.urlModel.findByIdAndUpdate(id, update, options);
  }

  public async findById(
    id: Types.ObjectId,
    projection?: ProjectionType<UrlDocument>,
    options?: QueryOptions<UrlDocument>,
  ): Promise<Url | null> {
    return this.urlModel.findById(id, projection, options);
  }

  public async updateSlugById(id: Types.ObjectId, slug: string, userId: Types.ObjectId): Promise<Url> {
    let url = await this.findById(id);
    if (!url) {
      throw new NotFoundException('Url not found');
    }

    if (!(await this.organizationsService.isManager(userId, url._id))) {
      throw new ForbiddenException('Not allowed');
    }

    url = await this.findOne({ domain: url.domain, slug });
    if (url) {
      throw new BadRequestException('Slug with this domain already exist');
    }

    if (!slug || !SLUG_REGEX.test(slug)) {
      throw new BadRequestException('Slug is not valid');
    }

    url = await this.findByIdAndUpdate(id, { $set: { slug, updatedBy: userId } }, { new: true });
    if (!url) {
      throw new NotFoundException('Url not found');
    }

    return url;
  }

  public async updateStatusById(id: Types.ObjectId, status: boolean, userId: Types.ObjectId): Promise<Url> {
    let url = await this.findById(id);
    if (!url) {
      throw new NotFoundException('Url not found');
    }

    if (!(await this.organizationsService.isManager(userId, url._id))) {
      throw new ForbiddenException('Not allowed');
    }

    url = await this.findByIdAndUpdate(id, { $set: { isActive: status } }, { new: true });
    if (!url) {
      throw new NotFoundException('Url not found');
    }

    return url;
  }

  public async deleteUrlById(id: Types.ObjectId, userId: Types.ObjectId): Promise<Url | null> {
    const url = await this.findById(id);
    if (!url) {
      throw new NotFoundException('Url not found');
    }

    if (!(await this.organizationsService.isManager(userId, url._id))) {
      throw new ForbiddenException('You are not allowed');
    }

    return this.findByIdAndDelete(id);
  }

  public async findByIdAndDelete(id?: Types.ObjectId, options?: QueryOptions<UrlDocument>): Promise<Url | null> {
    return this.urlModel.findByIdAndDelete(id, options);
  }
}
