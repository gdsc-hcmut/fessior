import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const FLAG_KEY = 'flag';
export const Flag = (flag: string): CustomDecorator => SetMetadata(FLAG_KEY, flag);
