import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { customAlphabet } from 'nanoid';
import { ALPHABET, DEFAULT_DOMAIN, SLUG_REGEX } from 'src/constants';

import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './schemas/url.schema';
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
    const { originalUrl, slug, domain = DEFAULT_DOMAIN, createdBy, updatedBy } = dto;

    let page = 1;
    let isAllowedToUseDomain = false;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    // TODO: cache domain -> organization -> managers
    if (domain !== DEFAULT_DOMAIN) {
      while (true) {
        const orgs = await this.organizationsService.findAll(page);
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        orgs.forEach(org => {
          if (org.managers.includes(createdBy) && org.domains.includes(domain)) {
            isAllowedToUseDomain = true;
          }
        });
        if (isAllowedToUseDomain || orgs.length === 0) {
          break;
        }
        page += 1;
      }

      if (!isAllowedToUseDomain) {
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

    url = await this.urlModel.create({ originalUrl, slug: slug || nanoid(), domain, createdBy, updatedBy });

    return url;
  }
}
