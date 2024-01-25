import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { ClientSession } from 'mongoose';

import { UserService } from '~/user/user.service';

import { LoginDto, RegisterDto } from './dto';
import { IAccessTokenData, IFingerprint } from './interfaces';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async login(
    loginDto: LoginDto,
    fingerprint: IFingerprint,
    session?: ClientSession,
  ) {
    const user = await this.userService.findOne(
      { email: loginDto.email },
      session,
    );

    if (!user || !(await compare(loginDto.password, user.password))) {
      return null;
    }

    return this.tokenService.generateTokens(user, fingerprint);
  }

  async logout(refreshToken: string, session?: ClientSession) {
    await this.tokenService.deleteRefreshToken(refreshToken, session);
  }

  async refresh(
    refreshToken: string,
    fingerprint: IFingerprint,
    session?: ClientSession,
  ) {
    const tokenData = await this.tokenService.deleteRefreshToken(
      refreshToken,
      session,
    );

    if (
      !tokenData ||
      tokenData?.fingerprint?.userAgent !== fingerprint.userAgent ||
      !tokenData?.user
    ) {
      return null;
    }

    return await this.tokenService.generateTokens(
      tokenData.user,
      fingerprint,
      session,
    );
  }

  async register(registerDto: RegisterDto, session?: ClientSession) {
    const user = await this.userService.create(
      {
        ...registerDto,
        birthday: registerDto.birthday,
      },
      session,
    );

    return user;
  }

  async validateUser(payload: IAccessTokenData) {
    const user = await this.userService.findById(payload.id);
    if (!user || user.isBlocked) {
      return null;
    }

    return user;
  }
}
