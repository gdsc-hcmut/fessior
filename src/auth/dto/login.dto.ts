import { IsOptional } from 'class-validator';

export class LoginDto {
  @IsOptional()
  public readonly token: string;

  @IsOptional()
  public readonly username: string;

  @IsOptional()
  public readonly password: string;
}
