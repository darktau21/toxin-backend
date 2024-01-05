import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

import { AuthService } from '~/auth/auth.service';
import { IAccessTokenData } from '~/auth/interfaces';
import { AppConfigService } from '~/config/app-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    configService: AppConfigService,
  ) {
    const { tokens } = configService.getSecurity();
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: tokens.accessSecret,
    } satisfies StrategyOptions);
  }

  async validate(payload: IAccessTokenData) {
    if (await this.authService.validateUser(payload)) {
      return payload;
    }

    return null;
  }
}
