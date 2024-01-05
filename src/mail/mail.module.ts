import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { resolve } from 'path';

import { AppConfigService } from '~/app/config';
import { MailerConfig } from '~/app/config';
import { MailService } from '~/mail/mail.service';

@Module({
  exports: [MailService],
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: AppConfigService): MailerOptions => {
        console.log(resolve(__dirname, 'mail', 'templates'));
        const mailConfig = configService.get<MailerConfig>('mail');
        return {
          defaults: {
            from: 'Toxin',
          },
          template: {
            dir: resolve(__dirname, 'mail', 'templates'),
            adapter: new HandlebarsAdapter(),
          },
          transport: {
            auth: {
              pass: mailConfig.password,
              user: mailConfig.user,
            },
            host: mailConfig.host,
            port: mailConfig.port,
            secure: mailConfig.secure,
          },
        };
      },
    }),
  ],
  providers: [MailService],
})
export class MailModule {}
