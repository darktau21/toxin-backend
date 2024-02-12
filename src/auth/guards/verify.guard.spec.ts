import type { ExecutionContext } from '@nestjs/common';
import type { HttpArgumentsHost } from '@nestjs/common/interfaces';
import type { FastifyRequest } from 'fastify';

import { createMock } from '@golevelup/ts-jest';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';

import { VerifyGuard } from './verify.guard';

describe('VerifyGuard', () => {
  let verifyGuard: VerifyGuard;
  let reflector: Reflector;

  const mockExecutionContext: ExecutionContext = createMock<ExecutionContext>();

  const mockHttpArgumentsHost: HttpArgumentsHost =
    createMock<HttpArgumentsHost>();

  const mockVerified = {
    isVerified: true,
  };

  const mockNotVerified = {
    isVerified: false,
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [VerifyGuard],
    })
      .useMocker(createMock)
      .compile();

    verifyGuard = module.get(VerifyGuard);
    reflector = module.get(Reflector);

    jest
      .spyOn(mockExecutionContext, 'switchToHttp')
      .mockReturnValue(mockHttpArgumentsHost);
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);
  });

  it('should be defined', () => {
    expect(verifyGuard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if verification decorator not exists', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      const result = verifyGuard.canActivate(mockExecutionContext);

      expect(result).toBeTruthy();
    });

    it('should return true if user verified', () => {
      jest.spyOn(mockHttpArgumentsHost, 'getRequest').mockReturnValue({
        user: mockVerified,
      } as unknown as FastifyRequest);

      const result = verifyGuard.canActivate(mockExecutionContext);

      expect(result).toBeTruthy();
    });

    it('should return false if user not verified', () => {
      jest.spyOn(mockHttpArgumentsHost, 'getRequest').mockReturnValue({
        user: mockNotVerified,
      } as unknown as FastifyRequest);

      const result = verifyGuard.canActivate(mockExecutionContext);

      expect(result).toBeFalsy();
    });
  });
});
