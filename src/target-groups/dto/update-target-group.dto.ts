import { PartialType } from '@nestjs/swagger';

import { CreateTargetGroupDto } from './create-target-group.dto';

export class UpdateTargetGroupDto extends PartialType(CreateTargetGroupDto) {}
