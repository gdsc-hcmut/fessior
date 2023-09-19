import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateTemplateDto {
  @IsEmail()
  public readonly email: string;

  @IsNotEmpty()
  public readonly name: string;
}
