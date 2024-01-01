import { IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { OrganizationType } from 'src/constants/types';

export class CreateOrganizationDto {
  @IsNotEmpty()
  public readonly longName: string;

  @IsNotEmpty()
  public readonly shortName: string;

  @IsNotEmpty()
  @IsMongoId({ each: true })
  public readonly managers: Types.ObjectId[];

  @IsNotEmpty()
  public readonly domains: string[];

  @IsNotEmpty()
  @IsEnum(OrganizationType)
  public readonly type: OrganizationType;

  @IsOptional()
  public createdBy: Types.ObjectId;

  @IsOptional()
  public updatedBy: Types.ObjectId;
}
