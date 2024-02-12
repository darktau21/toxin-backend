import { type DeepMocked, createMock } from '@golevelup/ts-jest';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Query, Types } from 'mongoose';

import { PaginationInfo } from '~/app/responses';
import { AppConfigService } from '~/config/app-config.service';
import { SecurityConfigSchema } from '~/config/schemas';

import { Genders, IUser, Roles } from './interfaces';
import { USER_SCHEMA_NAME } from './schemas';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let configService: AppConfigService;
  let userModel: DeepMocked<Model<IUser>>;
  let userQuery: Query<any, any>;

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
      providers: [
        UserService,
        {
          provide: getModelToken(USER_SCHEMA_NAME),
          useValue: createMock<Model<IUser>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    userService = module.get(UserService);
    configService = module.get(AppConfigService);
    userModel = module.get(getModelToken(USER_SCHEMA_NAME));

    userQuery = {
      exec: jest.fn(),
      lean: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
    } as unknown as Query<any, any>;

    jest.spyOn(userModel, 'find').mockReturnValue(userQuery);
    jest.spyOn(userModel, 'findById').mockReturnValue(userQuery);
    jest.spyOn(userModel, 'findOne').mockReturnValue(userQuery);
    jest.spyOn(userModel, 'findByIdAndUpdate').mockReturnValueOnce(userQuery);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findById', () => {
    it('should return user', async () => {
      jest.spyOn(userQuery, 'exec').mockResolvedValue(mockUser);

      const result = await userService.findById(mockUser._id.toString());

      expect(result).toEqual(mockUser);
    });

    it('should return null if id is wrong', async () => {
      const result = await userService.findById('jfgur');

      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should return user', async () => {
      jest.spyOn(userQuery, 'exec').mockResolvedValue(mockUser);

      const result = await userService.findOne({ email: mockUser.email });

      expect(result).toEqual(mockUser);
    });
  });

  describe('findMany', () => {
    beforeEach(() => {
      jest.spyOn(userQuery, 'exec').mockResolvedValue(mockUser);
      jest.spyOn(userModel, 'countDocuments').mockResolvedValue(1);
    });

    it('should return array with users array and pagination info', async () => {
      const mockPaginationInfo: PaginationInfo = {
        currentPage: 1,
        isLastPage: true,
        pagesCount: 1,
      };

      const result = await userService.findMany({
        name: mockUser.name,
      });

      expect(result).toEqual([mockUser, mockPaginationInfo]);
    });

    it('select method should be called', async () => {
      await userService.findMany({ name: mockUser.name, select: 'lastName' });

      expect(userQuery.select).toHaveBeenCalledWith('lastName');
    });

    it('sort method should be called', async () => {
      await userService.findMany({ name: mockUser.name, sort: 'birthday' });

      expect(userQuery.sort).toHaveBeenCalledWith('birthday');
    });
  });

  describe('create', () => {
    beforeEach(() => {
      jest.spyOn(userModel, 'create').mockResolvedValue(
        // @ts-expect-error returns wrong type
        [mockUser],
      );
      jest
        .spyOn(configService, 'getSecurity')
        .mockReturnValue({ passwordHashRounds: 1 } as SecurityConfigSchema);
    });

    it('should return new user', async () => {
      const result = await userService.create(mockUser);

      expect(result).toEqual(mockUser);
    });
  });

  describe('hardDelete', () => {
    it('should return true if user deleted', async () => {
      jest.spyOn(userQuery, 'exec').mockResolvedValue({ deletedCount: 1 });
      const result = await userService.hardDelete(mockUser._id.toString());

      expect(result).toStrictEqual(true);
    });
  });

  describe('softDelete', () => {
    const deletedUser: IUser = {
      ...mockUser,
      deletedAt: '2010-10-10',
      deletionDate: '2010-12-12',
      isDeleted: true,
    };

    beforeEach(() => {
      jest
        .spyOn(configService, 'getSecurity')
        .mockReturnValue({ deletedUserTtl: 1 } as SecurityConfigSchema);
    });

    it('should return deleted user', async () => {
      jest.spyOn(userService, 'update').mockResolvedValue(deletedUser);

      const result = await userService.softDelete(mockUser._id.toString());

      expect(result).toEqual(deletedUser);
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

  describe('restore', () => {
    it('should return restored user', async () => {
      jest.spyOn(userQuery, 'exec').mockResolvedValue(mockUser);

      const result = await userService.restore(mockUser._id.toString());

      expect(result).toEqual(mockUser);
    });
  });

  describe('onModuleInit', () => {
    it('should log message if admin user already exists', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userService, 'create');

      await userService.onModuleInit();

      expect(userService.create).not.toHaveBeenCalled();
    });

    it('should create admin user', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(null);
      jest.spyOn(userService, 'create');

      await userService.onModuleInit();

      expect(userService.create).toHaveBeenCalled();
    });
  });
});
