import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TokenDocument = HydratedDocument<Token>;

@Schema()
export class Token {
  @Prop({ type: Types.ObjectId, required: true, ref: 'users' })
  public userId: Types.ObjectId;

  @Prop({ default: true })
  public isActivate: boolean;

  @Prop({ default: Date.now() })
  public createdAt: number;

  @Prop({ default: Date.now() + 365 * 24 * 60 * 60 * 1000 })
  public expiredAt: number;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
