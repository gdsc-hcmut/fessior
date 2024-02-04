import { IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCategoryDto {
  @IsNotEmpty()
  public readonly name: string;

  @IsNotEmpty()
  public readonly color: string;

  @IsNotEmpty()
  public readonly organization: Types.ObjectId;

  @IsNotEmpty()
  public readonly urls: Types.ObjectId[];

  @IsOptional()
  public createdBy: Types.ObjectId;

  @IsOptional()
  public updatedBy: Types.ObjectId;
}
