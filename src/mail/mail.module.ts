import { Module } from '@nestjs/common';

import { mailProviders } from './mail.providers';
import { MailService } from './mail.service';

@Module({
  exports: [MailService],
  providers: [...mailProviders, MailService],
})
export class MailModule {}
