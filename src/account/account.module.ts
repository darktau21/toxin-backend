import { Module } from '@nestjs/common';

import { S3Module } from '~/s3/s3.module';

import { AccountController } from './account.controller';

@Module({
  controllers: [AccountController],
  imports: [S3Module],
})
export class AccountModule {}
