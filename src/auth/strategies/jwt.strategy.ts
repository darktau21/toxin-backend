import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

import { AppConfigService, SecurityConfig } from '~/app/config';
import { AuthService } from '~/auth/auth.service';
import { IAccessTokenData } from '~/auth/interfaces';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(ConfigService) private readonly configService: AppConfigService,
    private readonly authService: AuthService,
  ) {
    const { tokens } = configService.get<SecurityConfig>('security');
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
