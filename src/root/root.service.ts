import { Injectable, Logger } from '@nestjs/common';

import { UrlsService } from '../urls/urls.service';

@Injectable()
export class RootService {
  private readonly logger: Logger = new Logger(RootService.name);

  constructor(private readonly urlsService: UrlsService) {}
}
