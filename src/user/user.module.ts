import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppConfigService } from '~/config/app-config.service';
import { MailModule } from '~/mail/mail.module';

import { IsUniqueUserFieldConstraint } from './constraints';
import { PublicUserController } from './public-user.controller';
import { USER_SCHEMA_NAME, UserSchemaFactory } from './schemas';
import { UserService } from './user.service';

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
