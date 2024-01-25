import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { add } from 'date-fns';
import { ClientSession, Model } from 'mongoose';

import { asyncRandomBytes } from '~/app/utils';
import { AppConfigService } from '~/config/app-config.service';
import { UserService } from '~/user/user.service';

import { type IEmailConfirmationData } from './interfaces';
import { EMAIL_CONFIRMATION_DATA_SCHEMA_NAME, OldEmailData } from './schemas';

const CONFIRMATION_CODE_SIZE = 64;

@Injectable()
export class EmailService {
  constructor(
    @InjectModel(EMAIL_CONFIRMATION_DATA_SCHEMA_NAME)
    private readonly emailConfirmationDataModel: Model<IEmailConfirmationData>,
    @InjectModel(OldEmailData.name)
    private readonly oldEmailDataModel: Model<OldEmailData>,
    private readonly userService: UserService,
    private readonly configService: AppConfigService,
  ) {}

  private async generateConfirmationCode() {
    const confirmationCode = (
      await asyncRandomBytes(CONFIRMATION_CODE_SIZE / 2)
    ).toString('hex');

    return confirmationCode;
  }

  async confirm(code: string, userId: string, session?: ClientSession) {
    const emailConfirmationData = await this.emailConfirmationDataModel
      .findOneAndDelete({ code, userId }, { session })
      .lean()
      .exec();

    if (!emailConfirmationData) {
      return null;
    }

    this.userService.update(
      userId,
      {
        email: emailConfirmationData.newEmail,
        isVerified: true,
      },
      session,
    );

    return emailConfirmationData;
  }

  async restore(code: string, session?: ClientSession) {
    const emailData = await this.oldEmailDataModel
      .findOneAndDelete({ code }, { session })
      .lean()
      .exec();

    if (!emailData) {
      return null;
    }

    return this.userService.update(
      emailData.userId,
      {
        email: emailData.email,
        isVerified: true,
      },
      session,
    );
  }

  async saveOld(oldEmail: string, userId: string, session?: ClientSession) {
    const emailData = await this.oldEmailDataModel
      .findOne({ email: oldEmail }, {}, { session })
      .lean()
      .exec();
    if (emailData?.userId === userId) {
      return emailData;
    }

    const restoreCode = await this.generateConfirmationCode();
    await this.oldEmailDataModel.deleteOne({ email: oldEmail }, { session });

    const oldEmailData = await this.oldEmailDataModel.create(
      [
        {
          code: restoreCode,
          email: oldEmail,
          userId,
        },
      ],
      { session },
    );

    return oldEmailData[0];
  }

  async update(to: string, userId: string, session?: ClientSession) {
    const emailData = await this.emailConfirmationDataModel
      .findOne(
        {
          newEmail: to,
        },
        {},
        { session },
      )
      .lean()
      .exec();

    if (emailData?.userId === userId) {
      return emailData;
    }

    const confirmationCode = await this.generateConfirmationCode();

    this.userService.update(userId, { isVerified: false }, session);

    const { emailConfirmationTime } = this.configService.getSecurity();

    return this.emailConfirmationDataModel
      .findOneAndUpdate(
        { newEmail: to },
        {
          code: confirmationCode,
          expiresIn: add(Date.now(), { seconds: emailConfirmationTime }),
          userId,
        },
        { new: true, session, upsert: true },
      )
      .lean()
      .exec();
  }
}
