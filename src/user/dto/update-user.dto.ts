import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean } from 'class-validator';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'Заблокирован ли пользователь',
    type: Boolean,
  })
  @IsBoolean()
  @Type(() => Boolean)
  isBlocked: boolean;

  @ApiProperty({
    description: 'Удален ли пользователь',
    type: Boolean,
  })
  @IsBoolean()
  @Type(() => Boolean)
  isDeleted: boolean;
}
