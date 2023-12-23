import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUrlDto {
  @IsOptional()
  @IsString()
  public readonly slug: string;

  @IsOptional()
  @IsBoolean()
  public readonly isActive: boolean;
}
