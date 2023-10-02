import { IsNotEmpty } from 'class-validator';

export class CreateTemplateDto {
  @IsNotEmpty()
  public readonly name: string;
}
