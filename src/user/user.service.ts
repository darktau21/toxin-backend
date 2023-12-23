import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { Model } from 'mongoose';

import { AppConfigService } from '~/app/interfaces';
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

  async create(userData: Omit<User, 'isBlocked' | 'role'>): Promise<User> {
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
    await this.userModel.deleteOne({ _id: id }).exec();
    return null;
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
