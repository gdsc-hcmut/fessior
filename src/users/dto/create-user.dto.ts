import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public readonly email: string;

  @IsNotEmpty()
  public readonly name: string;
}
