import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { Model } from 'mongoose';

import type { SortUsersQueryDto } from '~/user/dto';

import { AppConfigService } from '~/app/interfaces';
import { clearObject, createFilterQuery } from '~/app/utils';
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
      throw new ConflictException({ email: 'user already exists' });
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

  async findById(id: string): Promise<User | null> {
    return await this.userModel
      .findOne({ _id: id, isDeleted: false })
      .lean()
      .exec();
  }
  async findMany({
    birthday,
    createdAt,
    sort,
    ...data
  }: SortUsersQueryDto): Promise<User[]> {
    // TODO добавить пагинацию и вынести сортировку в отдельную функцию
    const query = clearObject({
      ...data,
      birthday: createFilterQuery(birthday),
      createdAt: createFilterQuery(createdAt),
    });

    const users = this.userModel.find({ ...query, isDeleted: false });

    if (sort) {
      users.sort(sort);
    }

    return users.lean().exec();
  }

  async findOne(userQuery: Partial<User>): Promise<User | null> {
    return this.userModel.findOne(userQuery).lean().exec();
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, data, { new: true })
      .lean()
      .exec();
  }
}
