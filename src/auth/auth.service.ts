import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';

import { LoginDto, RegisterDto } from '~/auth/dto';
import { IAccessTokenData, IFingerprint } from '~/auth/interfaces';
import { TokenService } from '~/auth/token.service';
import { UserService } from '~/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async login(loginDto: LoginDto, fingerprint: IFingerprint) {
    const user = await this.userService.findOne({ email: loginDto.email });

    if (!user || !(await compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('wrong email or password');
    }

    return await this.tokenService.generateTokens(user, fingerprint);
  }

  async logout(refreshToken: string) {
    await this.tokenService.deleteRefreshToken(refreshToken);
  }

  async refresh(refreshToken: string, fingerprint: IFingerprint) {
    const refreshTokenData =
      await this.tokenService.deleteRefreshToken(refreshToken);
    const user = await this.userService.findById(refreshTokenData?.userId);

    if (
      !refreshTokenData ||
      refreshTokenData?.fingerprint?.userAgent !== fingerprint.userAgent ||
      !user
    ) {
      throw new UnauthorizedException('invalid refresh session');
    }

    return await this.tokenService.generateTokens(user, fingerprint);
  }

  async register(registerDto: RegisterDto) {
    return this.userService.create({
      ...registerDto,
      birthday: new Date(registerDto.birthday),
    });
  }

  async validateUser(payload: IAccessTokenData) {
    const user = await this.userService.findById(payload.id);
    if (!user || user.isBlocked) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
