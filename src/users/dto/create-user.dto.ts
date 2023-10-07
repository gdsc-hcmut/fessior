import { IsBoolean, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public readonly email: string;

  @IsBoolean()
  public readonly isManager: boolean;

  public readonly firstName: string | null;

  public readonly lastName: string | null;

  public readonly picture: string | null;

  public readonly googleId: string | null;

  public readonly appleId: string | null;

  public readonly dateOfBirth: string | null;

  public readonly phone: string | null;
}
