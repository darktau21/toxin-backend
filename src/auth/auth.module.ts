import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '~/auth/auth.controller';
import { AuthService } from '~/auth/auth.service';
import { JwtAuthGuard, UnauthorizedGuard } from '~/auth/guards';
import { JwtStrategy } from '~/auth/strategies';
import { TokenService } from '~/auth/token.service';
import { AppConfigService } from '~/config/app-config.service';
import { UserModule } from '~/user/user.module';

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    PassportModule,
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
  ],
  providers: [
    AuthService,
    TokenService,
    JwtStrategy,
    JwtAuthGuard,
    UnauthorizedGuard,
  ],
})
export class AuthModule {}
