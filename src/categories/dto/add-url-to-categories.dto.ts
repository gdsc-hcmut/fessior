import { IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class AddUrlToCategoriesDto {
  @IsNotEmpty()
  public readonly url: Types.ObjectId;

  @IsNotEmpty()
  public readonly categories: Types.ObjectId[];

  @IsOptional()
  public updatedBy: Types.ObjectId;
}
