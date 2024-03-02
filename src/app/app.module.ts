import { Module } from '@nestjs/common';

import { AccountModule } from '~/account/account.module';
import { AuthModule } from '~/auth/auth.module';
import { AppConfigModule } from '~/config/app-config.module';
import { EmailModule } from '~/email/email.module';
import { MailModule } from '~/mail/mail.module';
import { S3Module } from '~/s3/s3.module';
import { UserModule } from '~/user/user.module';

import { filters, guards, interceptors, pipes } from './app.providers';
import { dynamicModules } from './modules';

@Module({
  imports: [
    ...dynamicModules,
    AccountModule,
    AppConfigModule,
    AuthModule,
    EmailModule,
    MailModule,
    S3Module,
    UserModule,
  ],
  providers: [...guards, ...interceptors, ...pipes, ...filters],
})
export class AppModule {}
