import { PickType } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

import { RegisterDto } from '../dto';

export class LoginDto extends PickType(RegisterDto, ['password'] as const) {
  @IsEmail()
  email: string;
}
