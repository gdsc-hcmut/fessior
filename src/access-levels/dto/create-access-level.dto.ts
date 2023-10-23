import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Permission } from 'src/constants/types';

export class CreateAccessLevelDto {
  @IsString()
  public readonly name: string;

  @ApiProperty({
    description: 'list of permissions',
    isArray: true,
    enum: Permission,
  })
  @IsEnum(Permission, { each: true })
  public readonly permissions: Permission[];

  @IsOptional()
  @IsString({ each: true })
  public readonly users: string[] = [];
}
