import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppConfigService } from './env.interface';

@Module({
  imports: [
    ConfigModule.forRoot({ ignoreEnvFile: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: AppConfigService) => ({
        uri: configService.get('MONGO_CONNECTION_STRING'),
      }),
    }),
  ],
})
export class AppModule {}
