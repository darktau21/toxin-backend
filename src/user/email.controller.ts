import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { CurrentUser } from '~/auth/decorators';
import { JwtAuthGuard } from '~/auth/guards';
import { IAccessTokenData } from '~/auth/interfaces';

import { EmailService } from './email.service';
import { UserService } from './user.service';

@Controller('email')
@UseGuards(JwtAuthGuard)
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly userService: UserService,
  ) {}

  @Get(':code')
  async confirmEmail(
    @CurrentUser() currentUser: IAccessTokenData,
    @Param('code') code: string,
  ) {
    const status = await this.emailService.verifyConfirmationCode(
      currentUser.id,
      code,
    );
    return status;
  }
}
