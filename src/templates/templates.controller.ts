import { Body, Controller, Delete, Get, Param, Post, VERSION_NEUTRAL, Version } from '@nestjs/common';

import { CreateTemplateDto } from './dto/create-template.dto';
import { Template } from './schemas/template.schema';
import { TemplatesService } from './templates.service';

@Controller({
  path: 'templates',
  // version: '1', // Apply version 1 for these Controller.
  // version: ['1', '2'], // Apply both version 1 and 2 for whole Controller.
  // version: VERSION_NEUTRAL, // resource would not have the version present in the URI.
})
export class TemplatesController {
  constructor(private readonly templateService: TemplatesService) {}

  @Post()
  public async create(@Body() createTemplateDto: CreateTemplateDto): Promise<Template | null> {
    return this.templateService.create(createTemplateDto);
  }

  @Version('2') // This version will override the previous for these route
  @Get()
  public async findAll(): Promise<Template[]> {
    return this.templateService.findAll();
  }

  @Version(VERSION_NEUTRAL)
  @Get()
  public async findAllNeutral(): Promise<Template[]> {
    return this.templateService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<Template | null> {
    return this.templateService.findOne(id);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<Template | null> {
    return this.templateService.delete(id);
  }
}
