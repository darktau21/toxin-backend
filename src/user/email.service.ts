import { BadRequestException, GoneException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RedisService } from '@songkeys/nestjs-redis';
import Redis from 'ioredis';
import { Model } from 'mongoose';

import { REDIS_EMAILS } from '~/app/modules';
import { asyncRandomBytes } from '~/app/utils';
import { AppConfigService } from '~/config/app-config.service';
import { MailService } from '~/mail/mail.service';

import { User } from './schemas';

const CONFIRMATION_CODE_SIZE = 64;

@Injectable()
export class EmailService {
  private emailsDb: Redis;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly mailService: MailService,
    private readonly configService: AppConfigService,
    redis: RedisService,
  ) {
    this.emailsDb = redis.getClient(REDIS_EMAILS);
  }

  private async generateEmailConfirmationCode(id: string) {
    const confirmationCode = (
      await asyncRandomBytes(CONFIRMATION_CODE_SIZE / 2)
    ).toString('hex');

    const { emailConfirmationTime } = this.configService.getSecurity();

    await this.emailsDb.set(id, confirmationCode, 'EX', emailConfirmationTime);

    return confirmationCode;
  }

  async confirmEmail(user: User) {
    const emailConfirmationCode = await this.generateEmailConfirmationCode(
      user._id.toString(),
    );
    this.mailService.sendRegistrationEmail(user.email, {
      code: emailConfirmationCode,
      lastName: user.lastName,
      name: user.name,
    });
  }

  async verifyConfirmationCode(id: string, code: string) {
    const confirmationCode = await this.emailsDb.get(id);
    await this.emailsDb.del(id);

    if (!confirmationCode) {
      throw new GoneException('unknown confirmation code');
    }

    if (confirmationCode !== code) {
      throw new BadRequestException('wrong confirmation code');
    }

    await this.userModel.updateOne({ _id: id }, { isVerified: true });

    return { status: 'success' };
  }
}
