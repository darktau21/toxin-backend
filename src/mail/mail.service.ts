import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmationCode(email: string, code: string) {
    await this.mailerService.sendMail({
      context: {
        activationLink: `http://localhost:3000/v1/email/${code}`,
        subtitle: 'Подтверждение регистрации Toxin',
        title: 'Подтверждение Email',
      },
      subject: 'Подтверждение Email',
      template: 'email-confirmation',
      to: email,
    });
  }
}
