import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateTargetGroupDto {
  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  public users: Types.ObjectId[];

  @IsNotEmpty()
  public organizations: Types.ObjectId[];

  public createdBy: Types.ObjectId;

  public updatedBy: Types.ObjectId;
}
