import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AppConfigService } from '~/app/interfaces';
import { AuthController } from '~/auth/auth.controller';
import { AuthService } from '~/auth/auth.service';
import { JwtAuthGuard, RoleGuard } from '~/auth/guards';
import { UnauthorizedGuard } from '~/auth/guards';
import { JwtStrategy } from '~/auth/strategies';
import { UserModule } from '~/user/user.module';

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: AppConfigService) => ({
        secret: configService.get('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: +configService.get('JWT_ACCESS_EXP_TIME'),
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    RoleGuard,
    UnauthorizedGuard,
  ],
})
export class AuthModule {}
