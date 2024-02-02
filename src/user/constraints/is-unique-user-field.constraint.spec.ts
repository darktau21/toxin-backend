import { createMock } from '@golevelup/ts-jest';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { ValidationArguments } from 'class-validator';
import { Model } from 'mongoose';

import { IUser } from '../interfaces';
import { USER_SCHEMA_NAME } from '../schemas';
import { UserService } from '../user.service';
import { IsUniqueUserFieldConstraint } from './is-unique-user-field.constraint';

describe('IsUniquUserFieldConstraint', () => {
  let isUniqueUserFieldConstraint: IsUniqueUserFieldConstraint;
  let userService: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        IsUniqueUserFieldConstraint,
        UserService,
        {
          provide: getModelToken(USER_SCHEMA_NAME),
          useValue: createMock<Model<IUser>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    isUniqueUserFieldConstraint = module.get(IsUniqueUserFieldConstraint);
    userService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(isUniqueUserFieldConstraint).toBeDefined();
  });

  describe('defaultMessage', () => {
    it('should return string with provided property name', () => {
      const result = isUniqueUserFieldConstraint.defaultMessage({
        property: 'test',
      } as ValidationArguments);

      expect(result).toMatch(/test/);
    });
  });

  describe('validate', () => {
    it('should return true if user unique', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(null);

      const result = await isUniqueUserFieldConstraint.validate('test', {
        property: 'test',
      } as ValidationArguments);

      expect(result).toBe(true);
    });

    it('should return false if user is not unique', async () => {
      jest
        .spyOn(userService, 'findOne')
        .mockResolvedValue({ lastName: 'Test', name: 'Test' } as IUser);

      const result = await isUniqueUserFieldConstraint.validate('test', {
        property: 'test',
      } as ValidationArguments);

      expect(result).toBe(false);
    });

    it('should use provided property if *constraints* argument exists', async () => {
      jest.spyOn(userService, 'findOne');

      await isUniqueUserFieldConstraint.validate('test', {
        constraints: ['testProp'],
      } as ValidationArguments);

      expect(userService.findOne).toHaveBeenCalledWith({ testProp: 'test' });
    });
  });
});
