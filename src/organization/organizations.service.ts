import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions, Types } from 'mongoose';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'src/constants';
import { MongooseErrorCode } from 'src/constants/mongo-error-code';
import { OrganizationType } from 'src/constants/types';

import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization, OrganizationDocument } from './schemas/organization.schema';

@Injectable()
export class OrganizationsService {
  private readonly logger: Logger = new Logger(OrganizationsService.name);

  constructor(@InjectModel(Organization.name) private readonly organizationModel: Model<Organization>) {}

  public async createOrganizationForUser(userId: Types.ObjectId): Promise<Organization> {
    const dto: CreateOrganizationDto = {
      longName: 'Personal',
      shortName: 'Personal',
      managers: [userId],
      domains: [process.env.DEFAULT_DOMAIN],
      type: OrganizationType.PERSONAL,
      createdBy: userId,
      updatedBy: userId,
    };
    return this.create(dto);
  }

  public async create(dto: CreateOrganizationDto): Promise<Organization> {
    try {
      return await this.organizationModel.create(dto);
    } catch (err) {
      this.logger.error(`Failed to create organization: ${err}`);

      if (err.code === MongooseErrorCode.DUPLICATE_KEY) {
        throw new BadRequestException('Organization name already exists');
      }

      throw new InternalServerErrorException();
    }
  }

  public async findAllPaginated(
    page: number = DEFAULT_PAGE,
    limit: number = DEFAULT_PAGE_SIZE,
  ): Promise<Organization[]> {
    return this.organizationModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit);
  }

  public async find(
    filter: FilterQuery<OrganizationDocument>,
    projection?: ProjectionType<OrganizationDocument>,
    options?: QueryOptions<OrganizationDocument>,
  ): Promise<Organization[]> {
    return this.organizationModel.find(filter, projection, options);
  }

  public async isAllowedToUseDomain(organizationId: Types.ObjectId, manager: string, domain: string): Promise<boolean> {
    const org = await this.findOne({
      _id: organizationId,
      managers: { $eq: manager },
      domains: { $eq: domain },
    });

    return !!org;
  }

  public async isManager(userId: Types.ObjectId, organizationId: Types.ObjectId): Promise<boolean> {
    const org = await this.findOne({ _id: organizationId, managers: { $contains: userId } });

    return !!org;
  }

  public async getOrganizationsByUserId(userId: Types.ObjectId): Promise<Organization[]> {
    // TODO: cache userId -> organizations
    return this.find({ managers: { $eq: userId } });
  }

  public async isPartner(userId: string): Promise<boolean> {
    const org = await this.findOne({ managers: userId });

    return !!org;
  }

  public async findById(
    id: string,
    projections?: ProjectionType<OrganizationDocument>,
    options?: QueryOptions<OrganizationDocument>,
  ): Promise<Organization | null> {
    return this.organizationModel.findById(id, projections, options);
  }

  public async findOne(
    filter?: FilterQuery<OrganizationDocument>,
    projections?: ProjectionType<OrganizationDocument>,
    options?: QueryOptions<OrganizationDocument>,
  ): Promise<Organization | null> {
    return this.organizationModel.findOne(filter, projections, options);
  }

  public async updateOne(id: string, dto: UpdateOrganizationDto): Promise<Organization | null> {
    const { longName, shortName, domains, managers, updatedBy } = dto;
    return this.organizationModel.findByIdAndUpdate(
      id,
      {
        $set: { longName, shortName, updatedBy },
        $addToSet: {
          domains: { $each: domains },
          managers: { $each: managers },
        },
      },
      { new: true },
    );
  }

  public async removeManagersAndDomains(id: string, dto: UpdateOrganizationDto): Promise<Organization | null> {
    const { managers, domains } = dto;
    return this.organizationModel.findByIdAndUpdate(
      id,
      {
        $pullAll: { managers, domains },
      },
      { new: true },
    );
  }

  public async delete(id: string): Promise<Organization | null> {
    return this.organizationModel.findByIdAndDelete(id);
  }
}
