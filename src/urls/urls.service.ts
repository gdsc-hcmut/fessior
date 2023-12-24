import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
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
import { ALPHABET, DEFAULT_DOMAIN, DEFAULT_PAGE, DEFAULT_PAGE_SIZE, SLUG_REGEX } from 'src/constants';
import { Order, UrlSortOption } from 'src/constants/types';
import { getOrigin } from 'src/utils';

import { CreateUrlDto } from './dto/create-url.dto';
import { Url, UrlDocument } from './schemas/url.schema';
import { OrganizationsService } from '../organization/organizations.service';

const nanoid = customAlphabet(ALPHABET, 7);

@Injectable()
export class UrlsService {
  private readonly logger: Logger = new Logger(UrlsService.name);

  constructor(
    @InjectModel(Url.name) private readonly urlModel: Model<Url>,
    private readonly organizationsService: OrganizationsService,
  ) {}

  public async create(dto: CreateUrlDto): Promise<Url> {
    const { originalUrl, slug, domain = DEFAULT_DOMAIN, organizationId, createdBy, updatedBy } = dto;

    // TODO: cache domain -> organization -> managers
    if (
      domain !== DEFAULT_DOMAIN &&
      !(await this.organizationsService.isAllowedToUseDomain(createdBy.toString(), domain))
    ) {
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

  public async aggregate(pipeline?: PipelineStage[], options?: AggregateOptions): Promise<Url[]> {
    return this.urlModel.aggregate(pipeline, options);
  }

  public async getOriginalUrl(slug: string, domain: string, referer: string): Promise<string> {
    const url = await this.urlModel.findOne({ slug, domain });
    if (!url) {
      throw new NotFoundException('URL not found!');
    }

    url.totalClicks.push({ clickedAt: new Date(), origin: getOrigin(referer), ip: '' });
    await url.save();
    return url.originalUrl;
  }

  public async getTotalPages(
    organizationId: string,
    query?: string,
    limit: number = DEFAULT_PAGE_SIZE,
  ): Promise<number> {
    let count = 0;
    if (query) {
      count = await this.urlModel.countDocuments({
        organizationId,
        $or: [{ slug: { $regex: query } }, { originalUrl: { $regex: query } }],
      });
    } else {
      count = await this.urlModel.countDocuments({ organizationId });
    }

    if (count % limit) {
      return Math.ceil(count / limit);
    }
    return count / limit;
  }

  public async getUrlsByOrganizationId(
    organizationId: string,
    sort: UrlSortOption,
    order: Order,
    page: number = DEFAULT_PAGE,
    limit: number = DEFAULT_PAGE_SIZE,
  ): Promise<Url[]> {
    if (sort === 'time') {
      return this.find({ organizationId }, (page - 1) * limit, limit, { updatedAt: order });
    }

    return this.aggregate([
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
      { $sort: { clickCount: order === 'asc' ? 1 : -1, updatedAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);
  }

  public async searchUrlsByOrganizationId(
    organizationId: string,
    // sort: UrlSortOption,
    // order: Order,
    query: string,
    page: number = DEFAULT_PAGE,
    limit: number = DEFAULT_PAGE_SIZE,
  ): Promise<Url[]> {
    // return this.find({ organizationId, $text: { $search: query } }, (page - 1) * limit, limit, {
    //   updatedAt: -1,
    // });
    return this.find(
      { organizationId, $or: [{ slug: { $regex: query } }, { originalUrl: { $regex: query } }] },
      (page - 1) * limit,
      limit,
      { updatedAt: -1 },
    );
  }

  public async findByIdAndUpdate(
    id: string,
    update?: UpdateQuery<UrlDocument>,
    options?: QueryOptions<UrlDocument>,
  ): Promise<Url | null> {
    return this.urlModel.findByIdAndUpdate(id, update, options);
  }

  public async findById(
    id: string,
    projection?: ProjectionType<UrlDocument>,
    options?: QueryOptions<UrlDocument>,
  ): Promise<Url | null> {
    return this.urlModel.findById(id, projection, options);
  }

  public async updateSlugById(id: string, slug: string, userId: string): Promise<Url> {
    let url = await this.findById(id);
    if (!url) {
      throw new NotFoundException('Url not found');
    }

    if (!(await this.organizationsService.isManager(userId, url.organizationId.toString()))) {
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

  public async updateStatusById(id: string, status: boolean, userId: string): Promise<Url> {
    let url = await this.findById(id);
    if (!url) {
      throw new NotFoundException('Url not found');
    }

    if (!(await this.organizationsService.isManager(userId, url.organizationId.toString()))) {
      throw new ForbiddenException('Not allowed');
    }

    url = await this.findByIdAndUpdate(id, { $set: { isActive: status } }, { new: true });
    if (!url) {
      throw new NotFoundException('Url not found');
    }

    return url;
  }
}
