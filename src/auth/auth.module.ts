import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '~/auth/auth.controller';
import { AuthService } from '~/auth/auth.service';
import { JwtAuthGuard, UnauthorizedGuard } from '~/auth/guards';
import { JwtStrategy } from '~/auth/strategies';
import { TokenService } from '~/auth/token.service';
import { AppConfigService } from '~/config/app-config.service';
import { EmailModule } from '~/email/email.module';
import { MailModule } from '~/mail/mail.module';
import { UserModule } from '~/user/user.module';

import {
  REFRESH_TOKEN_DATA_SCHEMA_NAME,
  RefreshTokenDataSchemaFactory,
} from './schemas';

@Module({
  controllers: [AuthController],
  imports: [
    EmailModule,
    JwtModule.registerAsync({
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => {
        const { tokens } = configService.getSecurity();

        return {
          secret: tokens.accessSecret,
          signOptions: {
            expiresIn: tokens.accessExpTime,
          },
        };
      },
    }),
    MailModule,
    MongooseModule.forFeatureAsync([
      {
        collection: 'refreshTokens',
        inject: [AppConfigService],
        name: REFRESH_TOKEN_DATA_SCHEMA_NAME,
        useFactory: (configService: AppConfigService) => {
          const { tokens } = configService.getSecurity();
          return RefreshTokenDataSchemaFactory(tokens.refreshExpTime);
        },
      },
    ]),
    PassportModule,
    UserModule,
  ],
  providers: [
    AuthService,
    JwtAuthGuard,
    JwtStrategy,
    TokenService,
    UnauthorizedGuard,
  ],
})
export class AuthModule {}
