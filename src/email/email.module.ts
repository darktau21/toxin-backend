import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppConfigService } from '~/config/app-config.service';
import { MailModule } from '~/mail/mail.module';
import { UserModule } from '~/user/user.module';

import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import {
  EMAIL_CONFIRMATION_DATA_SCHEMA_NAME,
  EmailConfirmationDataSchemaFactory,
  OldEmailData,
  OldEmailDataSchema,
} from './schemas';

@Module({
  controllers: [EmailController],
  exports: [EmailService],
  imports: [
    MailModule,
    MongooseModule.forFeatureAsync([
      {
        collection: 'emailConfirmations',
        inject: [AppConfigService],
        name: EMAIL_CONFIRMATION_DATA_SCHEMA_NAME,
        useFactory: (configService: AppConfigService) => {
          const { emailConfirmationTime } = configService.getSecurity();
          return EmailConfirmationDataSchemaFactory(emailConfirmationTime);
        },
      },
    ]),
    MongooseModule.forFeature([
      {
        collection: 'oldEmails',
        name: OldEmailData.name,
        schema: OldEmailDataSchema,
      },
    ]),
    UserModule,
  ],
  providers: [EmailService],
})
export class EmailModule {}
