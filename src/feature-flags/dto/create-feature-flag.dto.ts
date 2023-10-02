import { IsString } from 'class-validator';

export class CreateFeatureFlagDto {
  @IsString()
  public readonly name: string;

  @IsString()
  public readonly key: string;

  @IsString()
  public readonly description: string;
}
