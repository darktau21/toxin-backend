import { type DeepMocked, createMock } from '@golevelup/ts-jest';
import { ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Query, Types } from 'mongoose';

import { Genders, Roles, User, type UserDocument } from '~/user/schemas';
import { UserService } from '~/user/user.service';

describe('UserService', () => {
  let userService: UserService;
  let configService: ConfigService;
  let userModel: DeepMocked<Model<User>>;
  const userQuery = {
    exec: jest.fn(),
    lean: jest.fn(),
  };

  const mockUser = {
    _id: new Types.ObjectId('6578b7e174334f130d4401f9'),
    birthday: '2002-04-13',
    email: 'test13@gmail.com',
    gender: Genders.MALE,
    isBlocked: false,
    isDeleted: false,
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

    jest
      .spyOn(userModel, 'findOne')
      .mockReturnValue(userQuery as unknown as Query<any, any>);
    jest
      .spyOn(userModel, 'find')
      .mockReturnValue(userQuery as unknown as Query<any, any>);
    jest
      .spyOn(userModel, 'findByIdAndUpdate')
      .mockReturnValue(userQuery as unknown as Query<any, any>);
    jest.spyOn(userQuery, 'lean').mockReturnThis();
  });

  it('userService should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findById', () => {
    it('should return user', async () => {
      jest.spyOn(userQuery, 'exec').mockResolvedValue(mockUser);
      const result = await userService.findById(mockUser._id.toString());

      expect(result).toEqual(mockUser);
    });
  });

  describe('findOne', () => {
    it('should return user', async () => {
      jest.spyOn(userQuery, 'exec').mockResolvedValue(mockUser);

      const result = await userService.findOne({ email: mockUser.email });
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
    it('should return null', async () => {
      const result = await userService.delete(mockUser._id.toString());
      expect(result).toStrictEqual(null);
    });
  });

  describe('findMany', () => {
    it('should return array with user', async () => {
      jest.spyOn(userQuery, 'exec').mockResolvedValue([mockUser]);

      const result = await userService.findMany({
        birthday: mockUser.birthday,
      });

      expect(result).toContain(mockUser);
    });

    it('should return empty array', async () => {
      jest.spyOn(userQuery, 'exec').mockResolvedValue([]);

      const result = await userService.findMany({
        birthday: '2014-01-01',
      });

      expect(result).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('should return updated user', async () => {
      jest
        .spyOn(userQuery, 'exec')
        .mockResolvedValue({ ...mockUser, isSubscriber: true });

      const result = await userService.update(mockUser._id.toString(), {
        isSubscriber: true,
      });

      expect(result).toEqual({ ...mockUser, isSubscriber: true });
    });
  });
});
