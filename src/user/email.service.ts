import {
  BadRequestException,
  GoneException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@songkeys/nestjs-redis';
import Redis from 'ioredis';

import { AppConfigService, MailerConfig } from '~/app/config';
import { REDIS_EMAILS } from '~/app/modules';
import { asyncRandomBytes } from '~/app/utils';
import { MailService } from '~/mail/mail.service';

import { UserService } from './user.service';

const CONFIRMATION_CODE_SIZE = 64;

@Injectable()
export class EmailService {
  private emailsDb: Redis;

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(ConfigService)
    private readonly configService: AppConfigService,
    private readonly mailService: MailService,
    redis: RedisService,
  ) {
    this.emailsDb = redis.getClient(REDIS_EMAILS);
  }

  async confirmEmail(id: string, code: string) {
    const confirmationCode = await this.emailsDb.get(id);

    if (!confirmationCode) {
      throw new GoneException('unknown confirmation code');
    }

    if (confirmationCode !== code) {
      throw new BadRequestException('wrong confirmation code');
    }

    const user = await this.userService.update(id, { isVerified: true });

    return user;
  }

  async generateEmailConfirmation(id: string, email: string) {
    const confirmationCode = (
      await asyncRandomBytes(CONFIRMATION_CODE_SIZE / 2)
    ).toString('hex');

    const { confirmationTime } = this.configService.get<MailerConfig>('mail');

    await this.emailsDb.set(id, confirmationCode, 'EX', confirmationTime);

    await this.mailService.sendConfirmationCode(email, confirmationCode);
  }
}
