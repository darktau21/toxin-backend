import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { redisStore } from 'cache-manager-redis-yet';
import { Connection } from 'mongoose';

import { AuthModule } from '~/auth/auth.module';
import { AppConfigService } from '~/env.interface';
import { UserModule } from '~/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, ignoreEnvFile: true, isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: AppConfigService) => ({
        connectionFactory: (connection: Connection) => {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          connection.plugin(require('mongoose-autopopulate'));
          return connection;
        },
        uri: configService.get('MONGO_CONNECTION_STRING'),
      }),
    }),
    CacheModule.registerAsync({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: AppConfigService) => ({
        store: redisStore,
        url: configService.get('REDIS_CONNECTION_STRING', { infer: true }),
      }),
    }),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
