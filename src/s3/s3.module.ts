import { Module } from '@nestjs/common';

import { s3Providers } from './s3.providers';
import { s3Services } from './services';

@Module({
  exports: [...s3Services],
  providers: [...s3Providers, ...s3Services],
})
export class S3Module {}
