import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Types } from 'mongoose';

import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsOptional()
  public readonly urlsToAdd: Types.ObjectId[];

  @IsOptional()
  public readonly urlsToRemove: Types.ObjectId[];
}
