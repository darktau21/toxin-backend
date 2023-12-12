import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

import { AppConfigService } from '~/env.interface';

import { AuthService } from '../auth.service';
import { IAccessTokenData } from '../interfaces';

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
