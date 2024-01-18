import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { add } from 'date-fns';
import { Model } from 'mongoose';

import {
  PaginatedResponse,
  applyFilters,
  clearObject,
  createFilterQuery,
  includeDeleted,
  paginate,
} from '~/app/utils';
import { AppConfigService } from '~/config/app-config.service';
import { SortUsersQueryDto, UserSortFields } from '~/user/dto';
import { USER_DELETE_TTL, User } from '~/user/schemas';

import { EmailService } from './email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly configService: AppConfigService,
    private readonly emailService: EmailService,
  ) {}

  private async hashPassword(password: string) {
    const { passwordHashRounds } = this.configService.getSecurity();
    return hash(password, passwordHashRounds);
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = await this.userModel.findOne({ email: userData.email });
    if (user) {
      throw new ConflictException('user already exists');
    }
    const hashedPassword = await this.hashPassword(userData.password);

    const createdUser = await this.userModel.create({
      ...userData,
      password: hashedPassword,
    });

    this.emailService.confirmEmail(createdUser);

    return createdUser;
  }

  async delete(id: string): Promise<null> {
    await this.userModel
      .findByIdAndUpdate(
        id,
        {
          deletedAt: new Date(),
          deletionDate: add(Date.now(), { seconds: USER_DELETE_TTL }),
          isDeleted: true,
        },
        { new: true },
      )
      .lean()
      .exec();
    return null;
  }

  async findById(
    id: string,
    includeRemoved: boolean = true,
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
    includeRemoved: boolean = true,
  ): Promise<PaginatedResponse & { users: User[] }> {
    const queryData = clearObject({
      ...data,
      birthday: createFilterQuery(birthday),
      createdAt: createFilterQuery(createdAt),
      isDeleted: includeDeleted(includeRemoved),
    });

    const usersQuery = this.userModel.find(queryData);

    const usersCount = await this.userModel.countDocuments(queryData);

    applyFilters(usersQuery, { select });
    const pagesData = paginate<UserSortFields>(usersQuery, {
      documentsCount: usersCount,
      limit,
      page,
      sort,
    });

    const users = await usersQuery.lean().exec();
    return { ...pagesData, users };
  }

  async findOne(
    userQuery: Partial<User>,
    includeRemoved: boolean = true,
  ): Promise<User | null> {
    return this.userModel
      .findOne({
        ...userQuery,
        isDeleted: includeDeleted(includeRemoved),
      })
      .lean()
      .exec();
  }

  async restore(id: string) {
    return this.update(id, { isDeleted: false });
  }

  async update(
    id: string,
    data: Partial<User>,
    includeRemoved: boolean = true,
  ): Promise<User | null> {
    return this.userModel
      .findOneAndUpdate(
        { _id: id, isDeleted: includeDeleted(includeRemoved) },
        data,
        { new: true },
      )
      .lean()
      .exec();
  }
}
