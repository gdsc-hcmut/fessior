import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUrlDto {
  @IsNotEmpty()
  @IsString()
  public readonly slug: string;
}
