import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { Platform } from 'src/constants/types';

export class CreateFeatureFlagDto {
  @IsNotEmpty()
  public readonly key: string;

  @IsNotEmpty()
  public readonly description: string;

  @IsNotEmpty()
  public readonly targetGroups: Types.ObjectId[];

  @IsNotEmpty()
  public readonly platforms: { name: Platform; minSupportedVersion: string }[];

  @IsBoolean()
  @IsOptional()
  public readonly isEnabled: boolean;

  @IsOptional()
  public createdBy: Types.ObjectId;

  @IsOptional()
  public updatedBy: Types.ObjectId;
}
