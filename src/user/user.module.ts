import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppConfigService } from '~/config/app-config.service';
import { MailModule } from '~/mail/mail.module';
import { PublicUserController } from '~/user/public-user.controller';
import { UserService } from '~/user/user.service';

import { IsUniqueUserFieldConstraint } from './constraints';
import { USER_SCHEMA_NAME, UserSchemaFactory } from './schemas';

@Module({
  controllers: [PublicUserController],
  exports: [UserService],
  imports: [
    CacheModule.register(),
    MailModule,
    MongooseModule.forFeatureAsync([
      {
        collection: 'users',
        inject: [AppConfigService],
        name: USER_SCHEMA_NAME,
        useFactory: (configService: AppConfigService) => {
          const { deletedUserTtl } = configService.getSecurity();
          return UserSchemaFactory(deletedUserTtl);
        },
      },
    ]),
  ],
  providers: [IsUniqueUserFieldConstraint, UserService],
})
export class UserModule {}
