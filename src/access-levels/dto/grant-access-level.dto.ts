import { IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { Permission } from 'src/constants/types';

export class GrantAccessLevelDto {
  @IsNotEmpty()
  @IsMongoId({ each: true })
  public readonly users: string[];

  @IsNotEmpty()
  @IsEnum(Permission, { each: true })
  public readonly permissions: Permission[];

  @IsOptional()
  public updatedBy: Types.ObjectId;
}
