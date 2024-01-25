import { PickType } from '@nestjs/swagger';

import { CreateUserDto } from '~/user/dto';

export class EmailDto extends PickType(CreateUserDto, ['email'] as const) {}
