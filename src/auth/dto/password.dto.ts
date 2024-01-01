import { IsOptional } from 'class-validator';

export class PasswordDto {
  @IsOptional()
  public readonly oldPassword: string;

  @IsOptional()
  public readonly newPassword: string;
}
