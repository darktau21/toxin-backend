import { PickType } from '@nestjs/swagger';

import { RegisterDto } from '~/auth/dto';

export class LoginDto extends PickType(RegisterDto, [
  'email',
  'password',
] as const) {}
