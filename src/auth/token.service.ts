import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { add } from 'date-fns';
import { ClientSession, Model } from 'mongoose';
import { v4 } from 'uuid';

import { AppConfigService } from '~/config/app-config.service';
import { IUser } from '~/user/interfaces';

import {
  IAccessTokenData,
  IFingerprint,
  IRefreshTokenData,
  ITokens,
} from './interfaces';
import { Fingerprint, REFRESH_TOKEN_DATA_SCHEMA_NAME } from './schemas';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(REFRESH_TOKEN_DATA_SCHEMA_NAME)
    private readonly refreshTokenModel: Model<IRefreshTokenData>,
    private readonly jwtService: JwtService,
    private readonly configService: AppConfigService,
  ) {}

  private async generateAccessToken(jwtData: IAccessTokenData) {
    return this.jwtService.signAsync(jwtData);
  }

  private async generateRefreshToken(
    userId: string,
    fingerprint: IFingerprint,
    session?: ClientSession,
  ) {
    const { tokens: config } = this.configService.getSecurity();

    const token = v4();
    const tokenData = await this.refreshTokenModel.create(
      [
        {
          expiresIn: add(new Date(), { seconds: config.refreshExpTime }),
          fingerprint,
          refreshToken: token,
          user: userId,
        },
      ],
      { session },
    );

    return tokenData[0];
  }

  async deleteRefreshToken(
    refreshToken: string,
    session?: ClientSession,
  ): Promise<IRefreshTokenData> {
    const refreshTokenData = await this.refreshTokenModel
      .findOneAndDelete(
        {
          refreshToken,
        },
        { session },
      )
      .populate('user')
      .lean()
      .exec();

    return refreshTokenData;
  }

  async generateTokens(
    user: Pick<IUser, '_id' | 'email' | 'role'>,
    fingerprint: Fingerprint,
    session?: ClientSession,
  ): Promise<ITokens> {
    const accessToken = await this.generateAccessToken({
      email: user.email,
      id: user._id.toString(),
      role: user.role,
    });

    const { refreshToken, ...refreshTokenData } =
      await this.generateRefreshToken(
        user._id.toString(),
        fingerprint,
        session,
      );

    return { accessToken, refreshToken, refreshTokenData };
  }
}
