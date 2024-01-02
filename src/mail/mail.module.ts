import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import * as path from 'path';

import { AppConfigService } from '~/app/config';
import { MailService } from '~/mail/mail.service';

@Module({
  exports: [MailService],
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: AppConfigService): MailerOptions => {
        return {
          defaults: {
            from: 'Toxin',
          },
          preview: true,
          template: {
            adapter: new PugAdapter(),
            dir: path.join(__dirname, 'templates'),
            options: {
              strict: true,
            },
          },
          transport: {
            auth: {
              pass: '9ju527o0s2',
              user: 'toxin@js-dev.su',
            },
            host: 'smtp.timeweb.ru',
            port: 25,
            secure: false,
          },
        };
      },
    }),
  ],
  providers: [MailService],
})
export class MailModule {}
