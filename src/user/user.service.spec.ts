import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Query } from 'mongoose';

import { AppConfigService } from '~/env.interface';

import { User } from './schemas';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let configService: AppConfigService;
  let model: Model<User>;

  const mockConfigService = {};
  const mockUserModel = {
    findById: jest.fn(),
    findOne: jest.fn(),
  };

  const mockUser = {
    _id: '6578b7e174334f130d4401f9',
    birthday: '2002-04-13',
    email: 'test13@gmail.com',
    gender: 'male',
    isBlocked: false,
    isSubscriber: false,
    lastName: 'Smith',
    name: 'John',
    password: '$2b$12$zZ9zhao2VOHf3EFVAjaaYusk1AyaR1NZb9OVyo4TlY5PrQ8jzTnVq',
    role: 'user',
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
    configService = module.get<AppConfigService>(ConfigService);
    model = module.get(getModelToken(User.name));
  });

  it('userService should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('configService should be defined', () => {
    expect(configService).toBeDefined();
  });

  describe('findById', () => {
    beforeEach(() => {
      jest
        .spyOn(model, 'findById')
        .mockReturnThis()
        .mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUser),
          select: jest.fn().mockReturnThis(),
        } as unknown as Query<User, any>);
    });

    it('model method should be called with provided id', async () => {
      await userService.findById(mockUser._id);

      expect(model.findById).toHaveBeenCalledWith(mockUser._id);
    });

    it('should return user with provided id', async () => {
      const result = await userService.findById(mockUser._id);

      expect(result).toStrictEqual(mockUser);
    });

    it('model select should be called', async () => {
      userService.findById(mockUser._id, true);

      expect(model.findById(mockUser._id).select).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    beforeEach(() => {
      jest
        .spyOn(model, 'findOne')
        .mockReturnThis()
        .mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUser),
          select: jest.fn().mockReturnThis(),
        } as unknown as Query<User, any>);
    });

    it('model method should be called with provided data', async () => {
      await userService.findOne({ email: mockUser.email });

      expect(model.findOne).toHaveBeenCalledWith({ email: mockUser.email });
    });

    it('should return user with provided data', async () => {
      const result = await userService.findOne({ email: mockUser.email });

      expect(result).toStrictEqual(mockUser);
    });

    it('model select should be called', async () => {
      userService.findOne({ email: mockUser.email }, true);

      expect(
        model.findOne({ email: mockUser.email }).select,
      ).toHaveBeenCalled();
    });
  });
});
