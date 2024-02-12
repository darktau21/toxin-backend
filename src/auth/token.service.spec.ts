import { createMock } from '@golevelup/ts-jest';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { type Model, type Query, Types } from 'mongoose';
import { v4, validate } from 'uuid';

import type { SecurityConfigSchema } from '~/config/schemas';

import { AppConfigService } from '~/config/app-config.service';
import { Genders, type IUser, Roles } from '~/user/interfaces';

import type { IFingerprint, IRefreshTokenData } from './interfaces';

import { REFRESH_TOKEN_DATA_SCHEMA_NAME } from './schemas';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let tokenService: TokenService;
  let configService: AppConfigService;
  let jwtService: JwtService;
  let refreshTokenModel: Model<IRefreshTokenData>;

  let query: Query<any, any>;

  const mockUser = {
    _id: new Types.ObjectId('6578b7e174334f130d4401f9'),
    birthday: '2002-04-13',
    email: 'test13@gmail.com',
    gender: Genders.MALE,
    isBlocked: false,
    isDeleted: false,
    isSubscriber: false,
    lastName: 'Smith',
    name: 'John',
    password: 'qwerty21',
    role: Roles.USER,
  } as IUser;
  const mockFingerprint: IFingerprint = {
    ip: '192.0.0.1',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; en-US) AppleWebKit/601.45 (KHTML, like Gecko) Chrome/52.0.1972.348 Safari/534.0 Edge/10.43428',
  };
  const mockAccessToken = 'sdkljroejroegfglhnfk';
  const mockRefreshToken = v4();
  const mockRefreshTokenData: IRefreshTokenData = {
    expiresIn: new Date(),
    fingerprint: mockFingerprint,
    refreshToken: mockRefreshToken,
    user: mockUser,
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: getModelToken(REFRESH_TOKEN_DATA_SCHEMA_NAME),
          useValue: createMock<Model<IRefreshTokenData>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    tokenService = module.get(TokenService);
    refreshTokenModel = module.get(
      getModelToken(REFRESH_TOKEN_DATA_SCHEMA_NAME),
    );
    configService = module.get(AppConfigService);
    jwtService = module.get(JwtService);

    query = {
      exec: jest.fn(),
      lean: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
    } as unknown as Query<any, any>;

    jest.spyOn(refreshTokenModel, 'findOneAndDelete').mockReturnValue(query);
  });

  it('should be defined', () => {
    expect(tokenService).toBeDefined();
  });

  describe('deleteRefreshToken', () => {
    it('should return deleted token data', async () => {
      jest.spyOn(query, 'exec').mockResolvedValue(mockRefreshTokenData);

      const result = await tokenService.deleteRefreshToken(mockRefreshToken);

      expect(result).toEqual(mockRefreshTokenData);
    });
  });

  describe('generateTokens', () => {
    beforeEach(() => {
      jest.spyOn(configService, 'getSecurity').mockReturnValue({
        tokens: { refreshExpTime: 1 },
      } as SecurityConfigSchema);

      jest
        .spyOn(refreshTokenModel, 'create')
        // @ts-expect-error returns wrong type
        .mockResolvedValue([mockRefreshTokenData]);

      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mockAccessToken);
    });

    it('should return refresh token', async () => {
      const result = await tokenService.generateTokens(
        mockUser,
        mockFingerprint,
      );

      expect(typeof result.refreshToken).toBe('string');
    });

    it('refresh token should be valid uuid', async () => {
      const result = await tokenService.generateTokens(
        mockUser,
        mockFingerprint,
      );

      expect(validate(result.refreshToken)).toBeTruthy();
    });

    it('should return access token', async () => {
      const result = await tokenService.generateTokens(
        mockUser,
        mockFingerprint,
      );

      expect(typeof result.accessToken).toBe('string');
    });
  });
});
