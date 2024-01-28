import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { AppConfigService } from '~/config/app-config.service';
import { EmailModule } from '~/email/email.module';
import { MailModule } from '~/mail/mail.module';
import { UserModule } from '~/user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard, UnauthorizedGuard } from './guards';
import {
  REFRESH_TOKEN_DATA_SCHEMA_NAME,
  RefreshTokenDataSchemaFactory,
} from './schemas';
import { JwtStrategy } from './strategies';
import { TokenService } from './token.service';

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
