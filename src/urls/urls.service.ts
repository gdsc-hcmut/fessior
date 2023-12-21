import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { customAlphabet } from 'nanoid';
import { ALPHABET, DEFAULT_DOMAIN, SLUG_REGEX } from 'src/constants';
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
    if (domain !== DEFAULT_DOMAIN) {
      if (!(await this.organizationsService.isAllowedToUseDomain(createdBy.toString(), domain))) {
        throw new BadRequestException('You are not allowed to use this domain');
      }
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
    projection?: ProjectionType<UrlDocument>,
    options?: QueryOptions<UrlDocument>,
  ): Promise<Url[]> {
    return this.urlModel.find(filter, projection, options);
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

  public async getUrlsByOrganizationId(organizationId: string): Promise<Url[]> {
    return this.find({ organizationId });
  }
}
