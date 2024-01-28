import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

import { AppConfigService } from '~/config/app-config.service';

import { AuthService } from '../auth.service';
import { IAccessTokenData } from '../interfaces';

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
    if (!(await this.authService.validateUser(payload))) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
