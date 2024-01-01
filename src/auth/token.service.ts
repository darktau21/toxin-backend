import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@songkeys/nestjs-redis';
import { add } from 'date-fns';
import Redis from 'ioredis';
import { v4 } from 'uuid';

import { AppConfigService, SecurityConfig } from '~/app/config';
import { REDIS_TOKENS } from '~/app/modules';
import {
  IAccessTokenData,
  IFingerprint,
  IRefreshTokenData,
} from '~/auth/interfaces';
import { User } from '~/user/schemas';

@Injectable()
export class TokenService {
  private tokensDb: Redis;

  constructor(
    @Inject(ConfigService) private readonly configService: AppConfigService,
    private readonly redis: RedisService,
    private readonly jwtService: JwtService,
  ) {
    this.tokensDb = this.redis.getClient(REDIS_TOKENS);
  }

  private async generateAccessToken(jwtData: IAccessTokenData) {
    return this.jwtService.signAsync(jwtData);
  }

  private async generateRefreshToken(
    userId: string,
    fingerprint: IFingerprint,
  ) {
    const { tokens: config } =
      this.configService.get<SecurityConfig>('security');

    const token = v4();
    const ttl = config.refreshExpTime;
    const tokenData: IRefreshTokenData = {
      expiresIn: add(new Date(), { seconds: ttl }).getTime(),
      fingerprint,
      refreshToken: token,
      userId,
    };

    await this.tokensDb.set(token, JSON.stringify(tokenData), 'EX', ttl);

    return { token, tokenData };
  }
  async deleteRefreshToken(refreshToken: string): Promise<IRefreshTokenData> {
    const refreshTokenData = JSON.parse(await this.tokensDb.get(refreshToken));
    await this.tokensDb.del(refreshToken);

    return refreshTokenData;
  }

  async generateTokens(user: User, fingerprint: IFingerprint) {
    const accessToken = await this.generateAccessToken({
      email: user.email,
      id: user._id.toString(),
      role: user.role,
    });

    const { token: refreshToken, tokenData: refreshTokenData } =
      await this.generateRefreshToken(user._id.toString(), fingerprint);

    return { accessToken, refreshToken, refreshTokenData };
  }
}
