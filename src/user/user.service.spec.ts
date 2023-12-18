import { ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Query } from 'mongoose';

import { Genders, User } from '~/user/schemas';
import { UserService } from '~/user/user.service';

describe('UserService', () => {
  let userService: UserService;
  let model: Model<User>;

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
    role: 'user',
  };

  const mockUserModel = {
    create: jest.fn(),
    deleteOne: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        ConfigService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
      ],
    }).compile();

    userService = module.get(UserService);
    model = module.get(getModelToken(User.name));
  });

  it('userService should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findById', () => {
    it('should return user', async () => {
      jest
        .spyOn(model, 'findById')
        .mockReturnThis()
        .mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUser),
        } as unknown as Query<User, any>);

      const result = await userService.findById(mockUser._id);

      expect(model.findById).toHaveBeenCalledWith(mockUser._id);
      expect(result).toEqual(mockUser);
    });

    it('should return user with additional fields', async () => {
      jest
        .spyOn(model, 'findById')
        .mockReturnThis()
        .mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUser),
          select: jest.fn().mockReturnThis(),
        } as unknown as Query<User, any>);

      const result = await userService.findById(mockUser._id, true);

      expect(model.findById(mockUser._id).select).toHaveBeenCalledWith([
        '+password',
        '+isBlocked',
      ]);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findOne', () => {
    it('should return user', async () => {
      jest
        .spyOn(model, 'findOne')
        .mockReturnThis()
        .mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUser),
        } as unknown as Query<User, any>);

      const result = await userService.findOne({ email: mockUser.email });

      expect(model.findOne).toHaveBeenCalledWith({ email: mockUser.email });
      expect(result).toEqual(mockUser);
    });

    it('should return user with additional data', async () => {
      jest
        .spyOn(model, 'findOne')
        .mockReturnThis()
        .mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUser),
          select: jest.fn().mockReturnThis(),
        } as unknown as Query<User, any>);

      const result = await userService.findOne({ email: mockUser.email }, true);

      expect(
        model.findOne({ email: mockUser.email }).select,
      ).toHaveBeenCalledWith(['+password', '+isBlocked']);

      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should return new user', async () => {
      jest.spyOn(model, 'create').mockImplementationOnce(
        // @ts-expect-error returns wrong type
        () => Promise.resolve(mockUser) as unknown as Promise<UserDocument>,
      );
      // @ts-expect-error hashPassword is a private method
      jest.spyOn(userService, 'hashPassword');
      jest.spyOn(model, 'findOne').mockResolvedValue(null);

      const result = await userService.create(mockUser);
      expect(result).toEqual(mockUser);

      // @ts-expect-error hashPassword method is private
      expect(userService.hashPassword).toHaveBeenCalledWith(mockUser.password);
    });

    it('should throw ConflictException if user with provided email already exists', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(mockUser);

      await expect(userService.create(mockUser)).rejects.toThrow(
        ConflictException,
      );

      expect(model.findOne).toHaveBeenCalledWith({ email: mockUser.email });
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      jest
        .spyOn(model, 'deleteOne')
        .mockReturnThis()
        // @ts-expect-error should return delete result
        .mockReturnValue({ exec: jest.fn() });

      await userService.delete(mockUser._id);
      expect(model.deleteOne).toBeCalledWith({ _id: mockUser._id });
    });

    it('should return null', async () => {
      const result = await userService.delete(mockUser._id);
      expect(result).toStrictEqual(null);
    });
  });
});
