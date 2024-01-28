import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { add } from 'date-fns';
import { ClientSession, Model } from 'mongoose';

import {
  PaginatedResponse,
  applyFilters,
  clearObject,
  createFilterQuery,
  paginate,
} from '~/app/utils';
import { AppConfigService } from '~/config/app-config.service';

import { SortUsersQueryDto, UserSortFields } from './dto';
import { Genders, IUser, Roles } from './interfaces';
import { USER_SCHEMA_NAME } from './schemas';

@Injectable()
export class UserService implements OnModuleInit {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(USER_SCHEMA_NAME) private readonly userModel: Model<IUser>,
    private readonly configService: AppConfigService,
  ) {}

  private async hashPassword(password: string) {
    const { passwordHashRounds } = this.configService.getSecurity();
    return hash(password, passwordHashRounds);
  }

  async create(
    userData: Partial<IUser>,
    session?: ClientSession,
  ): Promise<IUser> {
    const hashedPassword = await this.hashPassword(userData.password);
    const user = await this.userModel.create(
      [
        {
          ...userData,
          password: hashedPassword,
        },
      ],
      { session },
    );

    return user[0];
  }

  async findById(id: string, session?: ClientSession): Promise<IUser | null> {
    return this.userModel.findById(id, {}, { session }).lean().exec();
  }

  async findMany(
    {
      birthday,
      createdAt,
      limit,
      page,
      select,
      sort,
      ...data
    }: SortUsersQueryDto,
    session?: ClientSession,
  ): Promise<PaginatedResponse<IUser>> {
    const queryData = clearObject({
      ...data,
      birthday: createFilterQuery(birthday),
      createdAt: createFilterQuery(createdAt),
    });

    const usersQuery = this.userModel.find(queryData, {}, { session });

    const usersCount = await this.userModel.countDocuments(queryData, {
      session,
    });

    applyFilters(usersQuery, { select });
    const pagesData = paginate<UserSortFields>(usersQuery, {
      documentsCount: usersCount,
      limit,
      page,
      sort,
    });

    const users = await usersQuery.lean().exec();
    return [users, pagesData];
  }

  async findOne(
    userQuery: Partial<IUser>,
    session?: ClientSession,
  ): Promise<IUser | null> {
    return this.userModel
      .findOne(
        {
          ...userQuery,
        },
        {},
        { session },
      )
      .lean()
      .exec();
  }

  hardDelete(id: string, session?: ClientSession) {
    return this.userModel.deleteOne({ _id: id }, { session });
  }

  async onModuleInit() {
    const { email, password } = this.configService.getAdminAccount();
    const user = await this.findOne({ email });
    if (user) {
      this.logger.log('Admin user already exists');

      return;
    }

    this.create({
      birthday: new Date(0),
      email,
      gender: Genders.MALE,
      lastName: 'Admin',
      name: 'Admin',
      password,
      role: Roles.ADMIN,
    });
    this.logger.log('Admin user created');
  }

  async restore(id: string) {
    return this.update(id, { isDeleted: false });
  }

  softDelete(id: string, session?: ClientSession): Promise<IUser> {
    const { deletedUserTtl } = this.configService.getSecurity();

    return this.update(
      id,
      {
        deletedAt: new Date(),
        deletionDate: add(Date.now(), { seconds: deletedUserTtl }),
        isDeleted: true,
      },
      session,
    );
  }

  async update(
    id: string,
    data: Partial<IUser>,
    session?: ClientSession,
  ): Promise<IUser | null> {
    return this.userModel
      .findByIdAndUpdate(id, data, { new: true, session })
      .lean()
      .exec();
  }
}
