import type { FastifyReply } from 'fastify';
import type { ClientSession, Connection } from 'mongoose';

import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';

import type { LoginDto, RegisterDto } from '~/auth/dto';
import type {
  IFingerprint,
  IRefreshTokenData,
  ITokens,
} from '~/auth/interfaces';

import { HttpException } from '~/app/exceptions';
import { AuthController } from '~/auth/auth.controller';
import { AuthService } from '~/auth/auth.service';
import { EmailService } from '~/email/email.service';
import { Genders, type IUser } from '~/user/interfaces';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let emailService: EmailService;

  const mockRegisterDto: RegisterDto = {
    birthday: '2002-04-13',
    email: 'test13@gmail.com',
    gender: Genders.MALE,
    isSubscriber: false,
    lastName: 'Smith',
    name: 'John',
    password: 'qwerty21',
  };
  const mockLoginDto: LoginDto = {
    email: 'test@test.com',
    password: 'qwerty123',
  };
  const mockFingerprint: IFingerprint = {
    ip: '192.0.0.1',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; en-US) AppleWebKit/601.45 (KHTML, like Gecko) Chrome/52.0.1972.348 Safari/534.0 Edge/10.43428',
  };
  const mockAccessToken = 'sdkljroejroegfglhnfk';
  const newMockAccessToken = 'tiiqmqnfjroegfglhtlq';
  const mockRefreshToken = 'fklsdhfishfdshfhlsdfkh';
  const newMockRefreshToken = 'ajrmgmbishfdshqorkhmfum';
  const mockRefreshTokenData: IRefreshTokenData = {
    expiresIn: new Date(),
    fingerprint: mockFingerprint,
    refreshToken: mockRefreshToken,
    user: createMock<IUser>(),
  };
  const mockTokens: ITokens = {
    accessToken: mockAccessToken,
    refreshToken: mockRefreshToken,
    refreshTokenData: mockRefreshTokenData,
  };

  const mockResponse: FastifyReply = createMock<FastifyReply>();
  const mockSession: ClientSession = createMock<ClientSession>();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: 'DatabaseConnection',
          useValue: createMock<Connection>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    authController = module.get(AuthController);
    authService = module.get(AuthService);
    emailService = module.get(EmailService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return tokens', async () => {
      jest.spyOn(authService, 'login').mockResolvedValue(mockTokens);

      const result = await authController.login(
        mockLoginDto,
        mockFingerprint,
        mockResponse,
      );

      expect(result).toEqual(mockTokens);
    });

    it('should throw http exception if password or email wrong', async () => {
      jest.spyOn(authService, 'login').mockResolvedValue(null);

      await expect(
        authController.login(mockLoginDto, mockFingerprint, mockResponse),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('logout', () => {
    it('should clear cookie', async () => {
      jest.spyOn(mockResponse, 'clearCookie');

      await authController.logout(mockResponse, mockRefreshToken);

      expect(mockResponse.clearCookie).toHaveBeenCalled();
    });

    it('should return null', async () => {
      jest.spyOn(mockResponse, 'send');

      const result = await authController.logout(
        mockResponse,
        mockRefreshToken,
      );

      expect(result).toEqual(null);
    });
  });

  describe('register', () => {
    it('should should set cookie with provided refresh token', async () => {
      jest.spyOn(mockResponse, 'setCookie');

      await authController.register(
        mockRegisterDto,
        mockFingerprint,
        mockResponse,
        mockSession,
      );
      expect(mockResponse.setCookie).toHaveBeenCalledWith(
        expect.anything(),
        mockRefreshToken,
        expect.anything(),
      );
    });

    it('should return access token', async () => {
      jest.spyOn(authService, 'login').mockResolvedValue(mockTokens);

      const result = await authController.register(
        mockRegisterDto,
        mockFingerprint,
        mockResponse,
        mockSession,
      );
      expect(typeof result.accessToken).toBe('string');
    });

    it('should throw http exception if user already registered', async () => {
      jest.spyOn(emailService, 'update').mockResolvedValue(null);

      await expect(
        authController.register(
          mockRegisterDto,
          mockFingerprint,
          mockResponse,
          mockSession,
        ),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('refresh', () => {
    it('should should set cookie with new refresh token', async () => {
      jest.spyOn(mockResponse, 'setCookie');
      jest.spyOn(authService, 'refresh').mockResolvedValue({
        ...mockTokens,
        refreshToken: newMockRefreshToken,
      });

      await authController.refresh(
        mockRefreshToken,
        mockFingerprint,
        mockResponse,
        mockSession,
      );

      expect(mockResponse.setCookie).toHaveBeenCalledWith(
        expect.anything(),
        expect.not.stringMatching(mockRefreshToken),
        expect.anything(),
      );
    });

    it('should return new access token', async () => {
      jest.spyOn(authService, 'refresh').mockResolvedValue({
        ...mockTokens,
        accessToken: newMockAccessToken,
      });

      const result = await authController.refresh(
        mockRefreshToken,
        mockFingerprint,
        mockResponse,
        mockSession,
      );

      expect(result.accessToken).not.toBe(mockAccessToken);
    });

    it('should throw http exception if refresh session expired', async () => {
      jest.spyOn(authService, 'refresh').mockResolvedValue(null);

      await expect(
        authController.refresh(
          mockRefreshToken,
          mockFingerprint,
          mockResponse,
          mockSession,
        ),
      ).rejects.toThrow(HttpException);
    });
  });
});
