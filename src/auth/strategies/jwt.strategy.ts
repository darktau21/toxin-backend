import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

import { AuthService } from '~/auth/auth.service';
import { IAccessTokenData } from '~/auth/interfaces';
import { AppConfigService } from '~/env.interface';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(ConfigService) configService: AppConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
    } satisfies StrategyOptions);
  }

  async validate(payload: IAccessTokenData) {
    return this.authService.validateUser(payload);
  }
}
