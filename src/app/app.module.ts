import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { AccountModule } from '~/account/account.module';
import { dynamicModules } from '~/app/modules';
import { AuthModule } from '~/auth/auth.module';
import { JwtAuthGuard, RoleGuard } from '~/auth/guards';
import { AppConfigModule } from '~/config/app-config.module';
import { EmailModule } from '~/email/email.module';
import { MailModule } from '~/mail/mail.module';
import { UserModule } from '~/user/user.module';

@Module({
  imports: [
    ...dynamicModules,
    AccountModule,
    AppConfigModule,
    AuthModule,
    EmailModule,
    MailModule,
    UserModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class AppModule {}
