import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateUserDto } from './create-user.dto';

export class UpdateSelfUserDto extends PartialType(
  OmitType(CreateUserDto, ['role'] as const),
) {}
