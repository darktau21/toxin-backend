import type { ExecutionContext } from '@nestjs/common';
import type { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';

import { REFRESH_TOKEN_COOKIE } from '../interfaces';
import { UnauthorizedGuard } from './unauthorized.guard';

describe('UnauthorizedGuard', () => {
  let unauthorizedGuard: UnauthorizedGuard;

  const mockExecutionContext: ExecutionContext = createMock<ExecutionContext>();
  const mockHttpArgumentsHost: HttpArgumentsHost =
    createMock<HttpArgumentsHost>();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UnauthorizedGuard],
    })
      .useMocker(createMock)
      .compile();

    unauthorizedGuard = module.get(UnauthorizedGuard);

    jest
      .spyOn(mockExecutionContext, 'switchToHttp')
      .mockReturnValue(mockHttpArgumentsHost);
  });

  it('should be defined', () => {
    expect(unauthorizedGuard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return false if cookie is found', () => {
      jest.spyOn(mockHttpArgumentsHost, 'getRequest').mockReturnValue({
        cookies: { [REFRESH_TOKEN_COOKIE]: 'dsljflsdfsdjklfs' },
      });

      const result = unauthorizedGuard.canActivate(mockExecutionContext);

      expect(result).toBeFalsy();
    });

    it('should return  if cookie is not found', () => {
      jest.spyOn(mockHttpArgumentsHost, 'getRequest').mockReturnValue({
        cookies: { [REFRESH_TOKEN_COOKIE]: '' },
      });
      const result = unauthorizedGuard.canActivate(mockExecutionContext);
      expect(result).toBeTruthy();
    });
  });
});
