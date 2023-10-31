import { IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { Permission } from 'src/constants/types';

export class CreateAccessLevelDto {
  @IsNotEmpty()
  public readonly name: string;

  @IsNotEmpty()
  @IsEnum(Permission, { each: true })
  public readonly permissions: Permission[];

  @IsNotEmpty()
  @IsMongoId({ each: true })
  public readonly users: Types.ObjectId[];

  @IsOptional()
  public createdBy: Types.ObjectId;

  @IsOptional()
  public updatedBy: Types.ObjectId;
}
