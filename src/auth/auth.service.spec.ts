import { createMock } from '@golevelup/ts-jest';
import { CacheModule } from '@nestjs/cache-manager';
import { getModelToken } from '@nestjs/mongoose';
import { Test, type TestingModule } from '@nestjs/testing';
import { hashSync } from 'bcrypt';
import { type Model, Types } from 'mongoose';

import type {
  IAccessTokenData,
  IFingerprint,
  IRefreshTokenData,
  ITokens,
} from '~/auth/interfaces';

import { AuthService } from '~/auth/auth.service';
import { Genders, type IUser, Roles } from '~/user/interfaces';
import { USER_SCHEMA_NAME } from '~/user/schemas';
import { UserService } from '~/user/user.service';

import type { RegisterDto } from './dto';

import { REFRESH_TOKEN_DATA_SCHEMA_NAME } from './schemas';
import { TokenService } from './token.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let tokenService: TokenService;

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
  const mockAccessTokenData: IAccessTokenData = {
    id: '6578b7e174334f130d4401f9',
    role: Roles.USER,
  };
  const mockRefreshToken = 'fklsdhfishfdshfhlsdfkh';
  const mockRefreshTokenData: IRefreshTokenData = {
    expiresIn: new Date(),
    fingerprint: mockFingerprint,
    refreshToken: mockRefreshToken,
    user: mockUser,
  };
  const mockTokens: ITokens = {
    accessToken: mockAccessToken,
    refreshToken: mockRefreshToken,
    refreshTokenData: mockRefreshTokenData,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        AuthService,
        UserService,
        TokenService,
        {
          provide: getModelToken(REFRESH_TOKEN_DATA_SCHEMA_NAME),
          useValue: createMock<Model<IRefreshTokenData>>(),
        },
        {
          provide: getModelToken(USER_SCHEMA_NAME),
          useValue: createMock<Model<IUser>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    authService = module.get(AuthService);
    userService = module.get(UserService);
    tokenService = module.get(TokenService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should return new user', async () => {
      jest.spyOn(userService, 'create').mockResolvedValue(mockUser);

      const result = await authService.register(mockUser as RegisterDto);

      expect(result).toEqual(mockUser);
    });
  });

  describe('login', () => {
    beforeEach(() => {
      jest.spyOn(userService, 'findOne').mockResolvedValue({
        ...mockUser,
        password: hashSync(mockUser.password, 1),
      });
      jest.spyOn(tokenService, 'generateTokens').mockResolvedValue(mockTokens);
    });

    it('should return null if user not found', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(null);

      const result = await authService.login(mockUser, mockFingerprint);

      expect(result).toBeNull();
    });

    it('should return null if password is wrong', async () => {
      const result = await authService.login(
        { email: mockUser.email, password: 'test' },
        mockFingerprint,
      );

      expect(result).toBeNull();
    });

    it('should return access token', async () => {
      const result = await authService.login(mockUser, mockFingerprint);

      expect(typeof result.accessToken).toBe('string');
    });

    it('should return refresh token', async () => {
      const result = await authService.login(mockUser, mockFingerprint);

      expect(typeof result.refreshToken).toBe('string');
    });

    it('should return refresh token data', async () => {
      const result = await authService.login(mockUser, mockFingerprint);

      expect(result.refreshTokenData).toEqual(mockRefreshTokenData);
    });
  });

  describe('logout', () => {
    it('should return nothing', async () => {
      const result = await authService.logout('dshlfsdljfldksjf');

      expect(result).toBeUndefined();
    });
  });

  describe('validateUser', () => {
    it('should return null if user not found', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(null);

      const result = await authService.validateUser(mockAccessTokenData);

      expect(result).toBeNull();
    });

    it('should return null if user is blocked', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue({
        ...mockUser,
        isBlocked: true,
      });

      const result = await authService.validateUser(mockAccessTokenData);

      expect(result).toBeNull();
    });

    it('should return user', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(mockUser);

      const result = await authService.validateUser(mockAccessTokenData);

      expect(result).toEqual(mockUser);
    });
  });

  describe('refresh', () => {
    beforeEach(() => {
      jest
        .spyOn(tokenService, 'deleteRefreshToken')
        .mockResolvedValue(mockRefreshTokenData);
      jest.spyOn(tokenService, 'generateTokens').mockResolvedValue(mockTokens);
    });

    it('should return null if refresh token data not found', async () => {
      jest.spyOn(tokenService, 'deleteRefreshToken').mockResolvedValue(null);

      const result = await authService.refresh(
        mockRefreshToken,
        mockFingerprint,
      );

      expect(result).toBeNull();
    });

    it('should return null if user agent changed', async () => {
      jest.spyOn(tokenService, 'deleteRefreshToken').mockResolvedValue({
        ...mockRefreshTokenData,
        fingerprint: {
          ip: '0.0.0.0',
          userAgent:
            'Mozilla/5.0 (Linux i673 x86_64; en-US) AppleWebKit/603.24 (KHTML, like Gecko) Chrome/47.0.1673.104 Safari/533',
        },
      });

      const result = await authService.refresh(
        mockRefreshToken,
        mockFingerprint,
      );

      expect(result).toBeNull();
    });

    it('should return null if user not found', async () => {
      jest
        .spyOn(tokenService, 'deleteRefreshToken')
        .mockResolvedValue({ ...mockRefreshTokenData, user: null });

      const result = await authService.refresh(
        mockRefreshToken,
        mockFingerprint,
      );

      expect(result).toBeNull();
    });

    it('should return access token', async () => {
      const result = await authService.refresh(
        mockRefreshToken,
        mockFingerprint,
      );

      expect(typeof result.accessToken).toBe('string');
    });

    it('should return refresh token', async () => {
      const result = await authService.refresh(
        mockRefreshToken,
        mockFingerprint,
      );

      expect(typeof result.refreshToken).toBe('string');
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
