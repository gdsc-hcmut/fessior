import { Controller, Post, Body, UseGuards, Req, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { ObjectIdValidationPipe } from 'src/common';
import { ControllerResponse, Request } from 'src/constants/types';
import { injectUserId } from 'src/utils';

import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { Url } from './schemas/url.schema';
import { UrlsService } from './urls.service';
import { AuthGuard } from '../common/guards/auth.guard';

@ApiTags('urls')
@UseGuards(AuthGuard)
@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  public async create(@Req() req: Request, @Body() dto: CreateUrlDto): Promise<ControllerResponse<Url>> {
    injectUserId(dto, req.tokenMeta.userId);

    return { payload: await this.urlsService.create(dto) };
  }

  @Patch(':id/slug')
  public async updateSlug(
    @Req() req: Request,
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() dto: UpdateUrlDto,
  ): Promise<ControllerResponse<Url>> {
    return {
      payload: await this.urlsService.updateSlugById(new mongoose.Types.ObjectId(id), dto.slug, req.tokenMeta.userId),
    };
  }

  @Patch(':id/status')
  public async updateStatus(
    @Req() req: Request,
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() dto: UpdateUrlDto,
  ): Promise<ControllerResponse<Url>> {
    return {
      payload: await this.urlsService.updateStatusById(
        new mongoose.Types.ObjectId(id),
        dto.isActive,
        req.tokenMeta.userId,
      ),
    };
  }

  @Delete(':id')
  public async deleteUrl(
    @Req() req: Request,
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<ControllerResponse<Url | null>> {
    return {
      payload: await this.urlsService.deleteUrlById(new mongoose.Types.ObjectId(id), req.tokenMeta.userId),
    };
  }
}
