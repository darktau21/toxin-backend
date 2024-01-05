import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { dynamicModules } from '~/app/modules';
import { AuthModule } from '~/auth/auth.module';
import { AppConfigModule } from '~/config/app-config.module';
import { MailModule } from '~/mail/mail.module';
import { UserModule } from '~/user/user.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    AppConfigModule,
    MailModule,
    ...dynamicModules,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
