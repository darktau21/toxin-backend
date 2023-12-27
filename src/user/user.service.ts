import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { Model } from 'mongoose';

import { AppConfigService } from '~/app/interfaces';
import {
  PaginatedResponse,
  applyFilters,
  clearObject,
  createFilterQuery,
  includeDeleted,
  paginate,
} from '~/app/utils';
import { SortUsersQueryDto, UserSortFields } from '~/user/dto';
import { User } from '~/user/schemas';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(ConfigService) private readonly configService: AppConfigService,
  ) {}

  private async hashPassword(password: string) {
    return hash(password, +this.configService.get('PASSWORD_HASH_ROUNDS', 12));
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = await this.userModel.findOne({ email: userData.email });
    if (user) {
      throw new ConflictException('user already exists');
    }
    const hashedPassword = await this.hashPassword(userData.password);

    return await this.userModel.create({
      ...userData,
      password: hashedPassword,
    });
  }

  async delete(id: string): Promise<null> {
    await this.userModel
      .findByIdAndUpdate(id, { isDeleted: true }, { new: true })
      .lean()
      .exec();
    return null;
  }

  async findById(
    id: string,
    includeRemoved: boolean = false,
  ): Promise<User | null> {
    return await this.userModel
      .findOne({ _id: id, isDeleted: includeDeleted(includeRemoved) })
      .lean()
      .exec();
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
    includeRemoved: boolean = false,
  ): Promise<PaginatedResponse & { users: User[] }> {
    const queryData = clearObject({
      ...data,
      birthday: createFilterQuery(birthday),
      createdAt: createFilterQuery(createdAt),
      isDeleted: includeDeleted(includeRemoved),
    });

    const usersQuery = this.userModel.find(queryData);

    const usersCount = await this.userModel.countDocuments(queryData);

    applyFilters<UserSortFields>(usersQuery, { select, sort });
    const pagesData = paginate(usersQuery, {
      documentsCount: usersCount,
      limit: limit,
      page: page,
    });

    const users = await usersQuery.lean().exec();
    return { ...pagesData, users };
  }

  async findOne(
    userQuery: Partial<User>,
    includeRemoved: boolean = false,
  ): Promise<User | null> {
    return this.userModel
      .findOne({
        ...userQuery,
        isDeleted: includeDeleted(includeRemoved),
      })
      .lean()
      .exec();
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, data, { new: true })
      .lean()
      .exec();
  }
}
