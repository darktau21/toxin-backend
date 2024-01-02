import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendTest() {
    console.log('sending mail');
    const msg = await this.mailerService.sendMail({
      from: 'toxin@js-dev.su',
      subject: 'test',
      text: 'Test message',
      to: 'naumenkokirill466@gmail.com',
    });

    console.log(msg);
  }
}
