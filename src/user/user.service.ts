import {
  BadRequestException,
  ConflictException,
  GoneException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RedisService } from '@songkeys/nestjs-redis';
import { hash } from 'bcrypt';
import Redis from 'ioredis';
import { Model } from 'mongoose';

import { REDIS_EMAILS } from '~/app/modules';
import {
  PaginatedResponse,
  applyFilters,
  asyncRandomBytes,
  clearObject,
  createFilterQuery,
  includeDeleted,
  paginate,
} from '~/app/utils';
import { AppConfigService } from '~/config/app-config.service';
import { MailService } from '~/mail/mail.service';
import { SortUsersQueryDto, UserSortFields } from '~/user/dto';
import { User } from '~/user/schemas';

const CONFIRMATION_CODE_SIZE = 64;

@Injectable()
export class UserService {
  private emailsDb: Redis;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly configService: AppConfigService,
    private readonly mailService: MailService,
    redis: RedisService,
  ) {
    this.emailsDb = redis.getClient(REDIS_EMAILS);
  }

  private async hashPassword(password: string) {
    const { passwordHashRounds } = this.configService.getSecurity();
    return hash(password, passwordHashRounds);
  }

  async confirmEmail(id: string, code: string) {
    const confirmationCode = await this.emailsDb.get(id);
    await this.emailsDb.del(id);

    if (!confirmationCode) {
      throw new GoneException('unknown confirmation code');
    }

    if (confirmationCode !== code) {
      throw new BadRequestException('wrong confirmation code');
    }

    const user = await this.update(id, { isVerified: true });

    return user;
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

    await this.generateEmailConfirmation(createdUser.id, createdUser.email);

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

  async generateEmailConfirmation(id: string, email: string) {
    const confirmationCode = (
      await asyncRandomBytes(CONFIRMATION_CODE_SIZE / 2)
    ).toString('hex');

    const { confirmationTime } = this.configService.getMail();

    await this.emailsDb.set(id, confirmationCode, 'EX', confirmationTime);

    await this.mailService.sendConfirmationCode(email, confirmationCode);
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
      await this.generateEmailConfirmation(id, data.email);
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
