import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

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

  @IsOptional()
  public createdBy: Types.ObjectId;

  @IsOptional()
  public updatedBy: Types.ObjectId;
}
