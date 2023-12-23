import { type DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';

import type { IAccessTokenData } from '~/auth/interfaces';

import { AuthService } from '~/auth/auth.service';
import { JwtStrategy } from '~/auth/strategies';
import { Roles } from '~/user/schemas';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let authService: DeepMocked<AuthService>;

  const mockPayload: IAccessTokenData = {
    email: 'test13@gmail.com',
    id: '6578b7e174334f130d4401f9',
    role: Roles.USER,
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [JwtStrategy],
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
    it('should call validateUser auth service method with provided payload', async () => {
      jest.spyOn(authService, 'validateUser');
      await jwtStrategy.validate(mockPayload);

      expect(authService.validateUser).toHaveBeenCalledWith(mockPayload);
    });
  });
});
