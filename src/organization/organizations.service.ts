import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'src/constants';
import { MongooseErrorCode } from 'src/constants/mongo-error-code';

import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './schemas/organization.schema';

@Injectable()
export class OrganizationsService {
  private readonly logger: Logger = new Logger(OrganizationsService.name);

  constructor(@InjectModel(Organization.name) private readonly organizationModel: Model<Organization>) {}

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

  public async findAll(page: number = DEFAULT_PAGE, limit: number = DEFAULT_PAGE_SIZE): Promise<Organization[]> {
    return this.organizationModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit);
  }

  public async getOrganizationsByUserId(userId: string): Promise<Organization[]> {
    return this.organizationModel.find({ managers: { $in: [userId] } });
  }

  public async findOne(id: string): Promise<Organization | null> {
    return this.organizationModel.findById(id);
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
