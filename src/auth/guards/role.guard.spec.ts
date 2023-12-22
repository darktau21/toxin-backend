import type { ExecutionContext } from '@nestjs/common';
import type { HttpArgumentsHost } from '@nestjs/common/interfaces';
import type { FastifyRequest } from 'fastify';

import { type DeepMocked, createMock } from '@golevelup/ts-jest';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';

import { RoleGuard } from '~/auth/guards/role.guard';
import { Roles, type UserDocument } from '~/user/schemas';

describe('RoleGuard', () => {
  let roleGuard: RoleGuard;
  let reflector: DeepMocked<Reflector>;

  const mockExecutionContext: DeepMocked<ExecutionContext> =
    createMock<ExecutionContext>();

  const mockHttpArgumentsHost: DeepMocked<HttpArgumentsHost> =
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
    } as unknown as FastifyRequest & {
      user: UserDocument;
    });
  });

  it('should be defined', () => {
    expect(roleGuard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if roles is empty array', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);

      const result = roleGuard.canActivate(mockExecutionContext);

      expect(result).toBeTruthy();
    });

    it("should return true if roles didn't provided", () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);

      const result = roleGuard.canActivate(mockExecutionContext);

      expect(result).toBeTruthy();
    });

    it('should return true if user has needed role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Roles.ADMIN]);

      const result = roleGuard.canActivate(mockExecutionContext);

      expect(result).toBeTruthy();
    });

    it("should return false if user don't have", () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Roles.ADMIN]);
      jest.spyOn(mockHttpArgumentsHost, 'getRequest').mockReturnValue({
        user: mockUser,
      } as unknown as FastifyRequest & {
        user: UserDocument;
      });

      const result = roleGuard.canActivate(mockExecutionContext);

      expect(result).toBeFalsy();
    });
  });
});
