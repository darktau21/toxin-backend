import { S3 } from '@aws-sdk/client-s3';
import { type Provider } from '@nestjs/common';
import { lookup } from 'dns/promises';

import { AppConfigService } from '~/config/app-config.service';

export const S3_CLIENT = 'provider:s3client';

export const s3Providers: Provider[] = [
  {
    inject: [AppConfigService],
    provide: S3_CLIENT,
    useFactory: async (configService: AppConfigService) => {
      const {
        accessKeyId,
        forcePathStyle,
        host,
        lookup: shouldLookup,
        port,
        region,
        secretAccessKey,
        ssl,
      } = configService.getS3();

      return new S3({
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
        endpoint: `${ssl ? 'https' : 'http'}://${shouldLookup ? (await lookup(host)).address : host}:${port}`,
        forcePathStyle,
        region,
      });
    },
  },
];
