import { Body, Controller, Delete, Get, Param, Post, UseGuards, VERSION_NEUTRAL, Version } from '@nestjs/common';
import { ObjectIdValidationPipe } from 'src/common';
import { ControllerResponse } from 'src/constants/types';

import { CreateTemplateDto } from './dto/create-template.dto';
import { Template } from './schemas/template.schema';
import { TemplatesService } from './templates.service';
import { AuthGuard } from '../common/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller()
export class TemplatesController {
  constructor(private readonly templateService: TemplatesService) {}

  @Post()
  public async create(@Body() createTemplateDto: CreateTemplateDto): Promise<ControllerResponse<Template | null>> {
    return { payload: await this.templateService.create(createTemplateDto) };
  }

  @Version('2') // This version will override the previous for these route
  @Get()
  public async findAll(): Promise<ControllerResponse<Template[]>> {
    return { payload: await this.templateService.findAll() };
  }

  @Version(VERSION_NEUTRAL)
  @Get()
  public async findAllNeutral(): Promise<ControllerResponse<Template[]>> {
    return { payload: await this.templateService.findAll() };
  }

  @Get(':id')
  public async findOne(@Param('id', ObjectIdValidationPipe) id: string): Promise<ControllerResponse<Template | null>> {
    return { payload: await this.templateService.findOne(id) };
  }

  @Delete(':id')
  public async delete(@Param('id', ObjectIdValidationPipe) id: string): Promise<ControllerResponse<Template | null>> {
    return { payload: await this.templateService.delete(id) };
  }
}
