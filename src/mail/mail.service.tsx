import { Inject, Injectable } from '@nestjs/common';
import { render } from '@react-email/components';
import { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { ReactElement } from 'react';

import { MAIL_TRANSPORT } from './mail.providers';
import {
  RegistrationEmailConfirmation,
  RegistrationEmailConfirmationProps,
} from './templates';

@Injectable()
export class MailService {
  constructor(
    @Inject(MAIL_TRANSPORT) private readonly mailTransport: Transporter,
  ) {}

  private sendMail(
    mail: ReactElement,
    options: Pick<Mail.Options, 'attachments' | 'subject' | 'to'>,
  ) {
    const html = render(mail);

    this.mailTransport.sendMail({
      attachments: options.attachments,
      html,
      subject: options.subject,
      to: options.to,
    });
  }

  sendRegistrationEmail(to: string, props: RegistrationEmailConfirmationProps) {
    this.sendMail(<RegistrationEmailConfirmation {...props} />, {
      subject: 'Аккаунт успешно зарегистрирован',
      to,
    });
  }
}
