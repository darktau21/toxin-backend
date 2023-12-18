import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { RedisCache } from 'cache-manager-redis-yet';
import { add } from 'date-fns';
import { v4 } from 'uuid';

import { LoginDto, RegisterDto } from '~/auth/dto';
import {
  IAccessTokenData,
  IFingerprint,
  IRefreshTokenData,
} from '~/auth/interfaces';
import { AppConfigService } from '~/env.interface';
import { UserDocument } from '~/user/schemas';
import { UserService } from '~/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: RedisCache,
    @Inject(ConfigService) private readonly configService: AppConfigService,
  ) {}

  private async generateAccessToken(jwtData: IAccessTokenData) {
    return this.jwtService.signAsync(jwtData);
  }

  private async generateRefreshToken(
    userId: string,
    fingerprint: IFingerprint,
  ) {
    const token = v4();
    const ttl = +this.configService.get('JWT_REFRESH_EXP_TIME', 5_097_600);
    const tokenData: IRefreshTokenData = {
      expiresIn: add(new Date(), { seconds: ttl }).getTime(),
      fingerprint,
      refreshToken: token,
      userId,
    };

    await this.cacheManager.set(token, tokenData, ttl * 1000);

    return { token, tokenData };
  }

  private async generateTokens(user: UserDocument, fingerprint: IFingerprint) {
    const accessToken = await this.generateAccessToken({
      email: user.email,
      id: user.id,
      role: user.role,
    });

    const { token: refreshToken, tokenData: refreshTokenData } =
      await this.generateRefreshToken(user.id, fingerprint);

    return { accessToken, refreshToken, refreshTokenData };
  }

  async login(loginDto: LoginDto, fingerprint: IFingerprint) {
    const user = await this.userService.findOne(
      { email: loginDto.email },
      true,
    );

    if (!user || !(await compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('wrong email or password');
    }

    const tokens = await this.generateTokens(user, fingerprint);

    return tokens;
  }

  async refresh(refreshToken: string, fingerprint: IFingerprint) {
    const refreshTokenData =
      await this.cacheManager.get<IRefreshTokenData>(refreshToken);

    await this.cacheManager.del(refreshToken);

    if (
      !refreshTokenData ||
      refreshTokenData.fingerprint.userAgent !== fingerprint.userAgent
    ) {
      throw new UnauthorizedException('invalid refresh session');
    }

    const user = await this.userService.findById(refreshTokenData.userId);
    const tokens = await this.generateTokens(user, fingerprint);
    return tokens;
  }

  async register(registerDto: RegisterDto) {
    return this.userService.create(registerDto);
  }

  async validateUser(payload: IAccessTokenData) {
    const user = await this.userService.findById(payload.id, true);
    if (!user || user.isBlocked) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
