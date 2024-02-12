import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientSession } from 'mongoose';

import { FormatResponse, Transaction } from '~/app/decorators';
import { HttpException } from '~/app/exceptions';
import { WithTransactionInterceptor } from '~/app/interceptors';
import { ApiExceptionResponse, ApiOkResponse } from '~/app/swagger';
import { CurrentUser } from '~/auth/decorators';
import { MailService } from '~/mail/mail.service';
import { IUser } from '~/user/interfaces';

import { UpdateEmailDto } from './dto';
import { EmailService } from './email.service';
import { EmailDataResponse } from './responses';

const EMAIL_CONTROLLER_ROUTE = 'email';

@Controller(EMAIL_CONTROLLER_ROUTE)
@FormatResponse(EmailDataResponse)
@UseInterceptors(WithTransactionInterceptor)
@ApiTags('Работа с email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly mailService: MailService,
  ) {}

  @Get('confirm/:code')
  @ApiOkResponse(EmailDataResponse, null, {
    description: 'Подтверждение email',
  })
  @ApiExceptionResponse(HttpStatus.NOT_FOUND)
  async confirm(
    @CurrentUser() user: IUser,
    @Param('code') code: string,
    @Transaction() session: ClientSession,
  ) {
    const emailConfirmationData = await this.emailService.confirm(
      code,
      user._id.toString(),
      session,
    );

    if (!emailConfirmationData) {
      throw new HttpException(
        'wrong code or email confirmation expires',
        HttpStatus.NOT_FOUND,
      );
    }

    return emailConfirmationData;
  }

  @Get('restore/:code')
  @ApiOkResponse(EmailDataResponse, null, {
    description: 'Восстановление предыдущего email',
  })
  @ApiExceptionResponse(HttpStatus.NOT_FOUND)
  async restore(
    @CurrentUser() user: IUser,
    @Param('code') code: string,
    @Transaction() session: ClientSession,
  ) {
    const emailRestoringData = await this.emailService.restore(
      code,
      user._id.toString(),
      session,
    );

    if (!emailRestoringData) {
      throw new HttpException('wrong code', HttpStatus.NOT_FOUND);
    }

    return emailRestoringData;
  }

  @Post()
  @ApiOkResponse(EmailDataResponse, null, {
    description: 'Запрос на обновление email',
  })
  @ApiExceptionResponse(HttpStatus.BAD_REQUEST)
  async update(
    @CurrentUser() { _id, email, lastName, name }: IUser,
    @Body() emailData: UpdateEmailDto,
    @Transaction() session: ClientSession,
  ): Promise<EmailDataResponse> {
    const {
      code: confirmationCode,
      expiresIn,
      newEmail,
    } = await this.emailService.update(
      emailData.newEmail,
      _id.toString(),
      true,
      session,
    );
    const { code: resetCode, email: oldEmail } =
      await this.emailService.saveOld(email, _id.toString(), session);

    this.mailService.sendChangeEmailConfirmation(newEmail, {
      code: confirmationCode,
      lastName,
      name,
      newEmail,
      oldEmail,
    });

    this.mailService.sendChangeEmailNotification(oldEmail, {
      code: resetCode,
      lastName,
      name,
      newEmail,
      oldEmail,
    });

    return { expiresIn, newEmail, oldEmail };
  }
}
