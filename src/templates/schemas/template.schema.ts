import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TemplateDocument = HydratedDocument<Template>;

@Schema()
export class Template {
  @Prop({ required: true })
  public email: string;

  @Prop()
  public name: string;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
