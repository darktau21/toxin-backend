import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';

import type { IAccessTokenData } from '~/auth/interfaces';

import { HttpException } from '~/app/exceptions';
import { AuthService } from '~/auth/auth.service';
import { JwtStrategy } from '~/auth/strategies';
import { AppConfigService } from '~/config/app-config.service';
import { type IUser, Roles } from '~/user/interfaces';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let authService: AuthService;

  const mockPayload: IAccessTokenData = {
    id: '6578b7e174334f130d4401f9',
    role: Roles.USER,
  };
  const mockUser = createMock<IUser>();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: AppConfigService,
          useValue: {
            getSecurity: () => ({
              tokens: { accessSecret: 'secret' },
            }),
          } as AppConfigService,
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    jwtStrategy = module.get(JwtStrategy);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);

      const result = await jwtStrategy.validate(mockPayload);

      expect(result).toEqual(mockUser);
    });

    it('should throw http exception if invalid refresh session', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      await expect(jwtStrategy.validate(mockPayload)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
