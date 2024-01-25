import {
  Body,
  Controller,
  Get,
  GoneException,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

import { CurrentUser } from '~/auth/decorators';
import { IAccessTokenData } from '~/auth/interfaces';
import { MailService } from '~/mail/mail.service';
import { UserService } from '~/user/user.service';

import { EmailDto } from './dto/email.dto';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  @Get('confirm/:code')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirm(
    @CurrentUser() user: IAccessTokenData,
    @Param('code') code: string,
  ): Promise<null> {
    const emailConfirmationData = await this.emailService.confirm(
      code,
      user.id,
    );

    if (!emailConfirmationData) {
      throw new GoneException('wrong code or email confirmation expires');
    }

    return null;
  }

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @CurrentUser() user: IAccessTokenData,
    @Body() emailData: EmailDto,
  ): Promise<null> {
    await this.emailService.update(emailData.email, user.id);
    await this.emailService.saveOld(user.email, user.id);

    return null;
  }
}
