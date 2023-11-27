import { Controller, Get, Param, Req, Res, VERSION_NEUTRAL } from '@nestjs/common';
import { Response } from 'express';
import { Request } from 'src/constants/types';

import { UrlsService } from '../urls/urls.service';

@Controller({ version: VERSION_NEUTRAL })
export class RootController {
  constructor(private readonly urlsService: UrlsService) {}

  @Get('/:slug')
  public async getOriginalUrl(@Req() req: Request, @Res() res: Response, @Param('slug') slug: string): Promise<void> {
    const originalUrl = await this.urlsService.getOriginalUrl(slug, req.headers.host || '', req.headers.referer || '');

    return res.redirect(originalUrl);
  }
}
