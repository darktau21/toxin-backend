import { Module } from '@nestjs/common';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { resolve } from 'path';

import { AppConfigService } from '~/config/app-config.service';
import { MailService } from '~/mail/mail.service';

@Module({
  exports: [MailService],
  imports: [
    MailerModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService): MailerOptions => {
        console.log(resolve(__dirname, 'mail', 'templates'));
        const mailConfig = configService.getMail();
        return {
          defaults: {
            from: 'Toxin',
          },
          template: {
            adapter: new HandlebarsAdapter(),
            dir: resolve(__dirname, 'mail', 'templates'),
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
