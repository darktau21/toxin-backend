import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

import { HttpException } from '~/app/exceptions';
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
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new HttpException(
        'invalid refresh session',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }
}
