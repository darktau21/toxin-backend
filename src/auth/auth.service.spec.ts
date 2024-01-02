import type { RedisCache } from 'cache-manager-ioredis-yet';

import { type DeepMocked, createMock } from '@golevelup/ts-jest';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import { hash } from 'bcrypt';
import { Types } from 'mongoose';
import { validate } from 'uuid';

import type {
  IAccessTokenData,
  IFingerprint,
  IRefreshTokenData,
} from '~/auth/interfaces';

import { AuthService } from '~/auth/auth.service';
import { Genders, Roles, type UserDocument } from '~/user/schemas';
import { UserService } from '~/user/user.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: DeepMocked<UserService>;
  let configService: DeepMocked<ConfigService>;
  let cacheManager: DeepMocked<RedisCache>;

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
  };

  const mockFingerprint: IFingerprint = {
    ip: '192.0.0.1',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; en-US) AppleWebKit/601.45 (KHTML, like Gecko) Chrome/52.0.1972.348 Safari/534.0 Edge/10.43428',
  };

  const mockAccessTokenData: IAccessTokenData = {
    email: 'test13@gmail.com',
    id: '6578b7e174334f130d4401f9',
    role: Roles.USER,
  };

  const mockRefreshToken = 'fklsdhfishfdshfhlsdfkh';
  const mockRefreshTokenData: IRefreshTokenData = {
    expiresIn: 100_000,
    fingerprint: mockFingerprint,
    refreshToken: mockRefreshToken,
    userId: '6578b7e174334f130d4401f9',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: CACHE_MANAGER, useValue: createMock<RedisCache>() },
      ],
    })
      .useMocker(createMock)
      .compile();

    authService = module.get(AuthService);
    userService = module.get(UserService);
    configService = module.get(ConfigService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should return new user', async () => {
      jest.spyOn(userService, 'create').mockResolvedValue(mockUser);

      const result = await authService.register(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(null);

      await expect(
        authService.login(mockUser, mockFingerprint),
      ).rejects.toThrow(UnauthorizedException);
    });

    beforeEach(async () => {
      jest.spyOn(configService, 'get').mockReturnValue(10_000);

      const hashedPassword = await hash(mockUser.password, 1);
      jest.spyOn(userService, 'findOne').mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      } as unknown as UserDocument);
    });

    it('should throw an UnauthorizedException if password is wrong', async () => {
      await expect(
        authService.login(
          { email: mockUser.email, password: 'asdf12345' },
          mockFingerprint,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return access token', async () => {
      const result = await authService.login(mockUser, mockFingerprint);

      expect(result.accessToken).toBeDefined();
    });

    it('should return refresh token', async () => {
      const result = await authService.login(mockUser, mockFingerprint);

      expect(result.refreshToken).toBeDefined();
    });

    it('refresh token should be a valid uuid string', async () => {
      const result = await authService.login(mockUser, mockFingerprint);

      expect(validate(result.refreshToken)).toBeTruthy();
    });

    it('should return refresh token data', async () => {
      const result = await authService.login(mockUser, mockFingerprint);

      expect(result.refreshTokenData).toBeDefined();
    });
  });

  describe('logout', () => {
    it('should return nothing', async () => {
      const result = await authService.logout('dshlfsdljfldksjf');

      expect(result).toBeUndefined();
    });
  });

  describe('validateUser', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(null);

      await expect(
        authService.validateUser(mockAccessTokenData),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is blocked', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue({
        ...mockUser,
        isBlocked: true,
      } as unknown as UserDocument);

      await expect(
        authService.validateUser(mockAccessTokenData),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return user', async () => {
      jest
        .spyOn(userService, 'findById')
        .mockResolvedValue(mockUser as unknown as UserDocument);

      const result = await authService.validateUser(mockAccessTokenData);
      expect(result).toEqual(mockUser);
    });
  });

  describe('refresh', () => {
    it('should throw UnauthorizedException if refresh token data not found', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);

      await expect(
        authService.refresh(mockRefreshToken, mockFingerprint),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user agent changed', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue({
        ...mockRefreshTokenData,
        fingerprint:
          'Mozilla/5.0 (Linux i673 x86_64; en-US) AppleWebKit/603.24 (KHTML, like Gecko) Chrome/47.0.1673.104 Safari/533',
      });

      await expect(
        authService.refresh(mockRefreshToken, mockFingerprint),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(null);

      await expect(
        authService.refresh(mockRefreshToken, mockFingerprint),
      ).rejects.toThrow(UnauthorizedException);
    });

    beforeEach(async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(mockRefreshTokenData);
      jest
        .spyOn(userService, 'findById')
        .mockResolvedValue(mockUser as unknown as UserDocument);
      jest.spyOn(configService, 'get').mockReturnValue(10_000);
    });

    it('should return access token', async () => {
      const result = await authService.refresh(
        mockRefreshToken,
        mockFingerprint,
      );

      expect(result.accessToken).toBeDefined();
    });

    it('should return refresh token', async () => {
      const result = await authService.refresh(
        mockRefreshToken,
        mockFingerprint,
      );

      expect(result.refreshToken).toBeDefined();
    });

    it('refresh token should be a valid uuid string', async () => {
      const result = await authService.refresh(
        mockRefreshToken,
        mockFingerprint,
      );

      expect(validate(result.refreshToken)).toBeTruthy();
    });

    it('should return refresh token data', async () => {
      const result = await authService.refresh(
        mockRefreshToken,
        mockFingerprint,
      );

      expect(result.refreshTokenData).toBeDefined();
    });
  });
});
