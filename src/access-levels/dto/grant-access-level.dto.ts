import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class GrantAccessLevelDto {
  @IsNotEmpty()
  @IsMongoId({ each: true })
  public readonly users: string[];

  @IsOptional()
  public updatedBy: Types.ObjectId;
}
