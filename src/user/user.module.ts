import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppConfigService } from '~/config/app-config.service';

import { IsUniqueUserFieldConstraint } from './constraints';
import { PublicUserController } from './public-user.controller';
import { USER_SCHEMA_NAME, UserSchemaFactory } from './schemas';
import { UserService } from './user.service';

const USERS_COLLECTION_NAME = 'users';

@Module({
  controllers: [PublicUserController],
  exports: [UserService],
  imports: [
    CacheModule.register(),
    MongooseModule.forFeatureAsync([
      {
        collection: USERS_COLLECTION_NAME,
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
