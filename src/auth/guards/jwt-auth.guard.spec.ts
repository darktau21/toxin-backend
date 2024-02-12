import type { ExecutionContext } from '@nestjs/common';
import type { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { createMock } from '@golevelup/ts-jest';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';

import { Roles } from '~/user/interfaces';

import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let jwtAuthGuard: JwtAuthGuard;
  let reflector: Reflector;

  const mockExecutionContext: ExecutionContext = createMock<ExecutionContext>();

  const mockHttpArgumentsHost: HttpArgumentsHost =
    createMock<HttpArgumentsHost>();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [JwtAuthGuard],
    })
      .useMocker(createMock)
      .compile();

    jwtAuthGuard = module.get(JwtAuthGuard);
    reflector = module.get(Reflector);

    jest
      .spyOn(mockExecutionContext, 'switchToHttp')
      .mockReturnValue(mockHttpArgumentsHost);

    jest.spyOn(reflector, 'getAllAndMerge').mockReturnValue([Roles.ADMIN]);
  });

  it('should be defined', () => {
    expect(jwtAuthGuard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if isPublic decorator provided', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

      const result = jwtAuthGuard.canActivate(mockExecutionContext);

      expect(result).toBeTruthy();
    });
  });
});
