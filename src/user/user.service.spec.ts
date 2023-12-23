import { type DeepMocked, createMock } from '@golevelup/ts-jest';
import { ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Query } from 'mongoose';

import type { AppConfigService } from '~/app/interfaces';

import { Genders, Roles, User, type UserDocument } from '~/user/schemas';
import { UserService } from '~/user/user.service';

describe('UserService', () => {
  let userService: UserService;
  let configService: AppConfigService;
  let userModel: DeepMocked<Model<User>>;

  const mockUser = {
    _id: '6578b7e174334f130d4401f9',
    birthday: '2002-04-13',
    email: 'test13@gmail.com',
    gender: Genders.MALE,
    isBlocked: false,
    isSubscriber: false,
    lastName: 'Smith',
    name: 'John',
    password: 'qwerty21',
    role: Roles.USER,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: createMock<Model<User>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    userService = module.get(UserService);
    configService = module.get(ConfigService);
    userModel = module.get(getModelToken(User.name));
  });

  it('userService should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findById', () => {
    it('should return user', async () => {
      jest
        .spyOn(userModel, 'findById')
        .mockReturnThis()
        .mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUser),
        } as unknown as Query<User, any>);

      const result = await userService.findById(mockUser._id);

      expect(userModel.findById).toHaveBeenCalledWith(mockUser._id);
      expect(result).toEqual(mockUser);
    });

    it('should return user with additional fields', async () => {
      jest
        .spyOn(userModel, 'findById')
        .mockReturnThis()
        .mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUser),
          select: jest.fn().mockReturnThis(),
        } as unknown as Query<User, any>);

      const result = await userService.findById(mockUser._id, true);

      expect(userModel.findById(mockUser._id).select).toHaveBeenCalledWith([
        '+password',
        '+isBlocked',
      ]);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findOne', () => {
    it('should return user', async () => {
      jest
        .spyOn(userModel, 'findOne')
        .mockReturnThis()
        .mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUser),
        } as unknown as Query<User, any>);

      const result = await userService.findOne({ email: mockUser.email });

      expect(userModel.findOne).toHaveBeenCalledWith({ email: mockUser.email });
      expect(result).toEqual(mockUser);
    });

    it('should return user with additional data', async () => {
      jest
        .spyOn(userModel, 'findOne')
        .mockReturnThis()
        .mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUser),
          select: jest.fn().mockReturnThis(),
        } as unknown as Query<User, any>);

      const result = await userService.findOne({ email: mockUser.email }, true);

      expect(
        userModel.findOne({ email: mockUser.email }).select,
      ).toHaveBeenCalledWith(['+password', '+isBlocked']);

      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should return new user', async () => {
      jest.spyOn(userModel, 'create').mockImplementationOnce(
        // @ts-expect-error returns wrong type
        () => Promise.resolve(mockUser) as unknown as Promise<UserDocument>,
      );
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null);
      jest.spyOn(configService, 'get').mockReturnValue('1');

      const result = await userService.create(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if user with provided email already exists', async () => {
      jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValue(mockUser as unknown as UserDocument);

      await expect(userService.create(mockUser)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      jest
        .spyOn(userModel, 'deleteOne')
        .mockReturnThis()
        // @ts-expect-error should return delete result
        .mockReturnValue({ exec: jest.fn() });

      await userService.delete(mockUser._id);
      expect(userModel.deleteOne).toBeCalledWith({ _id: mockUser._id });
    });

    it('should return null', async () => {
      const result = await userService.delete(mockUser._id);
      expect(result).toStrictEqual(null);
    });
  });
});
