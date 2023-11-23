import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { Types } from 'mongoose';

export class CreateUrlDto {
  @IsUrl()
  public readonly originalUrl: string;

  @IsOptional()
  @IsNotEmpty()
  public readonly slug: string;

  @IsOptional()
  @IsString()
  public readonly domain: string;

  // @IsMongoId()
  // public readonly organization: Types.ObjectId;

  @IsOptional()
  public createdBy: Types.ObjectId;

  @IsOptional()
  public updatedBy: Types.ObjectId;
}
