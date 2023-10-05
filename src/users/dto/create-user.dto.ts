import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public readonly firstName: string;

  @IsString()
  public readonly lastName: string;

  @IsString()
  public readonly picture: string;

  @IsEmail()
  public readonly email: string;

  @IsBoolean()
  public readonly isManager: boolean;

  public readonly googleId: string | null;

  public readonly appleId: string | null;

  public readonly dateOfBirth: string | null;

  public readonly phone: string | null;
}
