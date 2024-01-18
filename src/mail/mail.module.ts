import { Module } from '@nestjs/common';

import { MailService } from '~/mail/mail.service';

import { mailProviders } from './mail.providers';

@Module({
  exports: [MailService],
  providers: [...mailProviders, MailService],
})
export class MailModule {}
