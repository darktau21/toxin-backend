import { createMock } from '@golevelup/ts-jest';
import { CacheModule } from '@nestjs/cache-manager';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';

import { PaginationInfo } from '~/app/responses';

import { IsUniqueUserFieldConstraint } from './constraints';
import { Genders, IUser, Roles } from './interfaces';
import { PublicUserController } from './public-user.controller';
import { USER_SCHEMA_NAME } from './schemas';
import { UserService } from './user.service';

describe('UserController', () => {
  let publicUserController: PublicUserController;
  let userService: UserService;

  const mockUser: IUser = {
    _id: new Types.ObjectId('6578b7e174334f130d4401f9'),
    birthday: '2002-04-13',
    createdAt: '2009-10-01',
    email: 'test13@gmail.com',
    gender: Genders.MALE,
    isBlocked: false,
    isDeleted: false,
    isSubscriber: false,
    isVerified: true,
    lastName: 'Smith',
    name: 'John',
    password: 'qwerty21',
    role: Roles.USER,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicUserController],
      imports: [CacheModule.register()],
      providers: [
        UserService,
        IsUniqueUserFieldConstraint,
        {
          provide: getModelToken(USER_SCHEMA_NAME),
          useValue: createMock<Model<IUser>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    publicUserController = module.get(PublicUserController);
    userService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(publicUserController).toBeDefined();
  });

  describe('getAll', () => {
    const mockPaginationInfo: PaginationInfo = {
      currentPage: 1,
      isLastPage: true,
      pagesCount: 1,
    };

    beforeEach(() => {
      jest
        .spyOn(userService, 'findMany')
        .mockResolvedValue([[mockUser], mockPaginationInfo]);
    });

    it('should return array with user', async () => {
      const result = await publicUserController.getAll({ name: mockUser.name });

      expect(result).toEqual([[mockUser], mockPaginationInfo]);
    });
  });

  describe('getById', () => {
    it('should return user', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(mockUser);

      const result = await publicUserController.getById(
        mockUser._id.toString(),
      );

      expect(result).toEqual(mockUser);
    });

    it('should return null when wrong id provided', async () => {
      jest.spyOn(userService, 'findById').mockResolvedValue(null);

      const result = await publicUserController.getById('fdsj');

      expect(result).toBeNull();
    });
  });
});
