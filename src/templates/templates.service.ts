import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateTemplateDto } from './dto/create-template.dto';
import { Template } from './schemas/template.schema';

@Injectable()
export class TemplatesService {
  private readonly logger: Logger = new Logger(TemplatesService.name);

  constructor(@InjectModel(Template.name) private readonly templateModel: Model<Template>) {}

  public async create(createTemplateDto: CreateTemplateDto): Promise<Template> {
    return this.templateModel.create(createTemplateDto);
  }

  public async findAll(): Promise<Template[]> {
    this.logger.log('Find all templates');
    return this.templateModel.find().exec();
  }

  public async findOne(id: string): Promise<Template | null> {
    return this.templateModel.findOne({ _id: id }).exec();
  }

  public async delete(id: string): Promise<Template | null> {
    return this.templateModel.findByIdAndRemove({ _id: id }).exec();
  }
}
