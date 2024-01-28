import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

// import { AccountModule } from '~/account/account.module';
import { Module } from '@nestjs/common';
import { AuthModule } from '~/auth/auth.module';
import { JwtAuthGuard, RoleGuard } from '~/auth/guards';
import { AppConfigModule } from '~/config/app-config.module';
import { EmailModule } from '~/email/email.module';
import { MailModule } from '~/mail/mail.module';
import { UserModule } from '~/user/user.module';

import { dynamicModules } from './modules';

@Module({
  imports: [
    ...dynamicModules,
    // AccountModule,
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
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ResponseWrapperInterceptor },
    { provide: APP_INTERCEPTOR, useClass: FormatResponseInterceptor },
    { provide: APP_PIPE, useClass: ParseQueryPipe },
    { provide: APP_PIPE, useClass: AppValidationPipe },
  ],
})
export class AppModule {}
