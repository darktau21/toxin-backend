import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AppConfigService, SecurityConfig } from '~/app/config';
import { AuthController } from '~/auth/auth.controller';
import { AuthService } from '~/auth/auth.service';
import { JwtAuthGuard, RoleGuard, UnauthorizedGuard } from '~/auth/guards';
import { JwtStrategy } from '~/auth/strategies';
import { TokenService } from '~/auth/token.service';
import { UserModule } from '~/user/user.module';

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: AppConfigService) => {
        const { tokens } = configService.get<SecurityConfig>('security');

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
    RoleGuard,
    UnauthorizedGuard,
  ],
})
export class AuthModule {}
