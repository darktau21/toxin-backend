import type { FastifyReply } from 'fastify';

import { type DeepMocked, createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import type { LoginDto, RegisterDto } from '~/auth/dto';
import type { IRefreshTokenData } from '~/auth/interfaces';

import { AuthController } from '~/auth/auth.controller';
import { AuthService } from '~/auth/auth.service';
import { Genders } from '~/user/schemas';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: DeepMocked<AuthService>;
  let configService: DeepMocked<ConfigService>;

  const mockLoginDto: LoginDto = {
    email: 'test@test.com',
    password: 'qwerty123',
  };

  const mockRegisterDto: RegisterDto = {
    birthday: '2002-04-13',
    email: 'test13@gmail.com',
    gender: Genders.MALE,
    isSubscriber: false,
    lastName: 'Smith',
    name: 'John',
    password: 'qwerty123',
  };

  const mockFingerprint = {
    ip: '192.0.0.1',
  };

  const mockRefreshToken = 'MOCK_REFRESH_TOKEN';
  const mockAccessToken = 'MOCK_ACCESS_TOKEN';
  const newMockRefreshToken = 'NEW_MOCK_REFRESH_TOKEN';
  const newMockAccessToken = 'NEW_MOCK_ACCESS_TOKEN';
  const mockRefreshTokenData: IRefreshTokenData = {
    expiresIn: 100_000,
    fingerprint: mockFingerprint,
    refreshToken: mockRefreshToken,
    userId: '6578b7e174334f130d4401f9',
  };

  const mockResponse: DeepMocked<FastifyReply> = createMock<FastifyReply>();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker(createMock)
      .compile();

    authController = module.get(AuthController);
    authService = module.get(AuthService);
    configService = module.get(ConfigService);

    jest.spyOn(configService, 'get').mockReturnValue('production');
    jest.spyOn(mockResponse, 'code').mockReturnThis();
    jest.spyOn(authService, 'login').mockResolvedValue({
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
      refreshTokenData: mockRefreshTokenData,
    });
    jest.spyOn(authService, 'refresh').mockResolvedValue({
      accessToken: newMockAccessToken,
      refreshToken: newMockRefreshToken,
      refreshTokenData: mockRefreshTokenData,
    });
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should call auth service login method with provided params', async () => {
      jest.spyOn(authService, 'login');
      await authController.login(mockLoginDto, mockFingerprint, mockResponse);
      expect(authService.login).toHaveBeenCalledWith(
        mockLoginDto,
        mockFingerprint,
      );
    });

    it('should should set cookie with provided refresh token', async () => {
      jest.spyOn(mockResponse, 'setCookie');

      await authController.login(mockLoginDto, mockFingerprint, mockResponse);
      expect(mockResponse.setCookie).toHaveBeenCalledWith(
        expect.anything(),
        mockRefreshToken,
        expect.anything(),
      );
    });

    it('should return provided access token', async () => {
      const result = await authController.login(
        mockLoginDto,
        mockFingerprint,
        mockResponse,
      );
      expect(result).toEqual({
        accessToken: mockAccessToken,
      });
    });
  });

  describe('logout', () => {
    it('should call logout auth service method with provided params', async () => {
      jest.spyOn(authService, 'logout');

      await authController.logout(mockResponse, mockRefreshToken);
      expect(authService.logout).toHaveBeenCalledWith(mockRefreshToken);
    });

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
    it('should call modules auth service method with provided params', async () => {
      await authController.register(
        mockRegisterDto,
        mockFingerprint,
        mockResponse,
      );

      expect(authService.register).toHaveBeenCalledWith(mockRegisterDto);
    });

    it('should call modules auth service method with provided params', async () => {
      await authController.register(
        mockRegisterDto,
        mockFingerprint,
        mockResponse,
      );

      expect(authService.login).toHaveBeenCalledWith(
        mockRegisterDto,
        mockFingerprint,
      );
    });

    it('should should set cookie with provided refresh token', async () => {
      jest.spyOn(mockResponse, 'setCookie');

      await authController.register(
        mockRegisterDto,
        mockFingerprint,
        mockResponse,
      );
      expect(mockResponse.setCookie).toHaveBeenCalledWith(
        expect.anything(),
        mockRefreshToken,
        expect.anything(),
      );
    });

    it('should return access token', async () => {
      const result = await authController.register(
        mockRegisterDto,
        mockFingerprint,
        mockResponse,
      );
      expect(result).toEqual({
        accessToken: mockAccessToken,
      });
    });
  });

  describe('refresh', () => {
    it('should call refresh auth service method with provided data', async () => {
      jest.spyOn(authService, 'refresh');

      await authController.refresh(
        mockRefreshToken,
        mockFingerprint,
        mockResponse,
      );

      expect(authService.refresh).toHaveBeenCalledWith(
        mockRefreshToken,
        mockFingerprint,
      );
    });

    it('should should set cookie with new refresh token', async () => {
      jest.spyOn(mockResponse, 'setCookie');

      await authController.refresh(
        mockRefreshToken,
        mockFingerprint,
        mockResponse,
      );

      expect(mockResponse.setCookie).toHaveBeenCalledWith(
        expect.anything(),
        newMockRefreshToken,
        expect.anything(),
      );
    });

    it('should return new access token', async () => {
      const result = await authController.refresh(
        mockRefreshToken,
        mockFingerprint,
        mockResponse,
      );
      expect(result).toEqual({
        accessToken: newMockAccessToken,
      });
    });
  });
});
