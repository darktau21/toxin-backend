import {
  ConflictException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { Model } from 'mongoose';

import { AppConfigService, SecurityConfig } from '~/app/config';
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

import { EmailService } from './email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(ConfigService) private readonly configService: AppConfigService,
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService,
  ) {}

  private async hashPassword(password: string) {
    const { passwordHashRounds } =
      this.configService.get<SecurityConfig>('security');
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

    await this.emailService.generateEmailConfirmation(
      createdUser.id,
      createdUser.email,
    );

    return createdUser;
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
    if (data.email) {
      data.isVerified = false;
      await this.emailService.generateEmailConfirmation(id, data.email);
    }

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
