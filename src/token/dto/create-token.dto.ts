import { IsBoolean, IsNumber } from 'class-validator';
import { Types } from 'mongoose';

export class CreateTokenDto {
  @IsBoolean()
  public readonly isActivate: boolean;

  @IsNumber()
  public readonly createdAt: number;

  @IsNumber()
  public readonly expiredAt: number;

  public readonly userId: Types.ObjectId;
}
