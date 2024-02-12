import type { ExecutionContext } from '@nestjs/common';
import type { HttpArgumentsHost } from '@nestjs/common/interfaces';
import type { FastifyRequest } from 'fastify';

import { createMock } from '@golevelup/ts-jest';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';

import { Roles } from '~/user/interfaces';

import { RoleGuard } from './role.guard';

describe('RoleGuard', () => {
  let roleGuard: RoleGuard;
  let reflector: Reflector;

  const mockExecutionContext: ExecutionContext = createMock<ExecutionContext>();

  const mockHttpArgumentsHost: HttpArgumentsHost =
    createMock<HttpArgumentsHost>();

  const mockAdmin = {
    role: Roles.ADMIN,
  };

  const mockUser = {
    role: Roles.USER,
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [RoleGuard],
    })
      .useMocker(createMock)
      .compile();

    roleGuard = module.get(RoleGuard);
    reflector = module.get(Reflector);

    jest
      .spyOn(mockExecutionContext, 'switchToHttp')
      .mockReturnValue(mockHttpArgumentsHost);

    jest.spyOn(mockHttpArgumentsHost, 'getRequest').mockReturnValue({
      user: mockAdmin,
    } as unknown as FastifyRequest);
    jest.spyOn(reflector, 'getAllAndMerge').mockReturnValue([Roles.ADMIN]);
  });

  it('should be defined', () => {
    expect(roleGuard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if roles is empty array', () => {
      jest.spyOn(reflector, 'getAllAndMerge').mockReturnValue([]);

      const result = roleGuard.canActivate(mockExecutionContext);

      expect(result).toBeTruthy();
    });

    it("should return true if roles didn't provided", () => {
      jest.spyOn(reflector, 'getAllAndMerge').mockReturnValue(null);

      const result = roleGuard.canActivate(mockExecutionContext);

      expect(result).toBeTruthy();
    });

    it('should return true if user has required role', () => {
      const result = roleGuard.canActivate(mockExecutionContext);

      expect(result).toBeTruthy();
    });

    it("should return false if user don't have required role", () => {
      jest.spyOn(mockHttpArgumentsHost, 'getRequest').mockReturnValue({
        user: mockUser,
      } as unknown as FastifyRequest);

      const result = roleGuard.canActivate(mockExecutionContext);

      expect(result).toBeFalsy();
    });
  });
});
