import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { Model } from 'mongoose';

import { AppConfigService } from '~/env.interface';

import { User } from './schemas';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(ConfigService) private readonly configService: AppConfigService,
  ) {}

  private async hashPassword(password: string) {
    return hash(password, +this.configService.get('PASSWORD_HASH_ROUNDS', 12));
  }

  async create(userData: Omit<User, 'isBlocked' | 'role'>) {
    const user = await this.userModel.findOne({ email: userData.email });
    if (user) {
      throw new ConflictException('user already exists');
    }
    const hashedPassword = await this.hashPassword(userData.password);
    const newUser = new this.userModel({
      ...userData,
      password: hashedPassword,
    });
    await newUser.save();
    return newUser;
  }

  async delete(id: string) {
    return this.userModel.deleteOne({ _id: id }).exec();
  }

  async findById(id: string, includeHidden: boolean = false) {
    const user = this.userModel.findById(id);

    if (includeHidden) {
      user.select(['+password', '+isBlocked']);
    }

    return user.exec();
  }

  async findOne(userQuery: Partial<User>, includeHidden: boolean = false) {
    const user = this.userModel.findOne(userQuery);

    if (includeHidden) {
      user.select(['+password', '+isBlocked']);
    }

    return user.exec();
  }
}
