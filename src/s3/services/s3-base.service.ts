import type { Bucket, S3 } from '@aws-sdk/client-s3';
import type { MemoryStorageFile } from '@blazity/nest-file-fastify';

import { Inject, Logger, type OnModuleInit, Type, mixin } from '@nestjs/common';

import type { IS3BaseService } from '../interfaces/s3-base-service.interface';

import { S3_CLIENT } from '../s3.providers';

export function S3BaseService(
  bucketName: string,
  grantRead: string = '/',
): Type<IS3BaseService> {
  class S3BaseService implements IS3BaseService, OnModuleInit {
    private readonly logger = new Logger('S3');
    @Inject(S3_CLIENT) protected readonly s3Client: S3;

    async onModuleInit() {
      const bucketsList = await this.s3Client.listBuckets({});

      if (
        bucketsList.Buckets.some((bucket: Bucket) => bucket.Name === bucketName)
      ) {
        this.logger.log(`Bucket ${bucketName} already exists`);
        return;
      }

      await this.s3Client.createBucket({
        Bucket: bucketName,
        GrantRead: grantRead,
      });
      this.logger.log(`Bucket ${bucketName} created`);
    }

    put(key: string, file: MemoryStorageFile) {
      return this.s3Client.putObject({
        Body: file.buffer,
        Bucket: bucketName,
        ContentType: file.mimetype,
        Key: key,
      });
    }
  }

  const baseService = mixin(S3BaseService);

  return baseService as Type<IS3BaseService>;
}
