import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'Заблокирован ли пользователь',
    type: Boolean,
  })
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  isBlocked?: boolean;
}
