import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ClientSession } from 'mongoose';

import { Transaction } from '~/app/decorators';
import { HttpException } from '~/app/exceptions';
import { WithTransactionInterceptor } from '~/app/interceptors';
import { CurrentUser } from '~/auth/decorators';
import { IAccessTokenData } from '~/auth/interfaces';

import { EmailDto } from './dto';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('confirm/:code')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(WithTransactionInterceptor)
  async confirm(
    @CurrentUser() user: IAccessTokenData,
    @Param('code') code: string,
    @Transaction() session: ClientSession,
  ): Promise<null> {
    const emailConfirmationData = await this.emailService.confirm(
      code,
      user.id,
      session,
    );

    if (!emailConfirmationData) {
      throw new HttpException(
        { code: ['wrong code or email confirmation expires'] },
        HttpStatus.GONE,
      );
    }

    return null;
  }

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(WithTransactionInterceptor)
  async update(
    @CurrentUser() user: IAccessTokenData,
    @Body() emailData: EmailDto,
    @Transaction() session: ClientSession,
  ): Promise<null> {
    await this.emailService.update(emailData.email, user.id, session);
    await this.emailService.saveOld(user.email, user.id, session);

    return null;
  }
}
