import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerResponse, Request } from 'src/constants/types';
import { injectUserId } from 'src/utils';

import { CreateUrlDto } from './dto/create-url.dto';
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
}
