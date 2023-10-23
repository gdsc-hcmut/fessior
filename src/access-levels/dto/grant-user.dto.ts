import { IsString } from 'class-validator';

export class UserArrayDto {
  @IsString({ each: true })
  public users: string[];
}
