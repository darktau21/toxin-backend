import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@songkeys/nestjs-redis';
import { redisInsStore } from 'cache-manager-ioredis-yet';

import { AppConfigService, RequestsConfig } from '~/app/config';
import { REDIS_CACHE } from '~/app/modules/redis.module';

export const cacheModule = CacheModule.registerAsync({
  inject: [RedisService, ConfigService],
  isGlobal: true,
  useFactory: async (
    redisService: RedisService,
    configService: AppConfigService,
  ) => {
    const { cacheTtl } = configService.get<RequestsConfig>('requests');
    return {
      store: redisInsStore(redisService.getClient(REDIS_CACHE), {
        ttl: cacheTtl * 1000,
      }),
    };
  },
});
