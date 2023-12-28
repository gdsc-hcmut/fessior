import {
  Controller,
  UseGuards,
  Req,
  Get,
  Query,
  ParseIntPipe,
  Param,
  ForbiddenException,
  ParseEnumPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ObjectIdValidationPipe } from 'src/common';
import { ControllerResponse, Order, Request, UrlSortOption } from 'src/constants/types';

import { OrganizationsService } from './organizations.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { Url } from '../urls/schemas/url.schema';
import { UrlsService } from '../urls/urls.service';

@ApiTags('organizations')
@UseGuards(AuthGuard)
@Controller()
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService, private readonly urlsService: UrlsService) {}

  @Get(':id/urls')
  public async getUrls(
    @Req() req: Request,
    @Param('id', ObjectIdValidationPipe) id: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('sort', new ParseEnumPipe(UrlSortOption)) sort: UrlSortOption,
    @Query('order', new ParseEnumPipe(Order)) order: Order,
  ): Promise<ControllerResponse<{ urls: Url[]; size: number; totalPages: number }>> {
    const { userId } = req.tokenMeta;

    if (!(await this.organizationsService.isManager(userId.toString(), id))) {
      throw new ForbiddenException('You are not allowed');
    }

    const urls = await this.urlsService.getUrlsByOrganizationId(id, sort, order, page, limit);
    const totalPages = await this.urlsService.getTotalPages(id, limit);

    return { payload: { size: urls.length, totalPages, urls } };
  }

  @Get(':id/urls/search')
  public async searchUrls(
    @Req() req: Request,
    @Param('id', ObjectIdValidationPipe) id: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    // @Query('sort', new ParseEnumPipe(UrlSortOption)) sort: UrlSortOption,
    // @Query('order', new ParseEnumPipe(Order)) order: Order,
    @Query('q') q: string,
  ): Promise<ControllerResponse<{ urls: Url[]; size: number; totalPages: number }>> {
    const { userId } = req.tokenMeta;

    if (!(await this.organizationsService.isManager(userId.toString(), id))) {
      throw new ForbiddenException('You are not allowed');
    }

    const urls = await this.urlsService.searchUrlsByOrganizationId(id, q, page, limit);
    const totalPages = await this.urlsService.getTotalPages(id, limit, q);

    return { payload: { size: urls.length, totalPages, urls } };
  }
}
