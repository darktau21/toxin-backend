import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

import { IsUniqueUserField } from '~/user/decorators';

import { IsUniqueNewEmailData } from '../decorators';

export class UpdateEmailDto {
  @IsString()
  @IsEmail()
  @IsUniqueNewEmailData({
    message: 'change request for this email already sent',
  })
  @IsUniqueUserField('email', {
    message: 'user with this email already registered',
  })
  @ApiProperty({ description: 'Новый email', type: String })
  newEmail: string;
}
