import { CacheModule } from '@nestjs/cache-manager';
import { RedisModule, RedisService } from '@songkeys/nestjs-redis';
import { Config } from 'cache-manager';
import { redisInsStore } from 'cache-manager-ioredis-yet';

import { REDIS_CACHE } from '~/app/modules/redis.module';
import { AppConfigService } from '~/config/app-config.service';

export const cacheModule = CacheModule.registerAsync<Config>({
  inject: [RedisService, AppConfigService],
  useFactory: async (
    redisService: RedisService,
    configService: AppConfigService,
  ) => {
    const { cacheTtl } = configService.getRequests();
    return {
      store: redisInsStore(redisService.getClient(REDIS_CACHE), {
        ttl: cacheTtl * 1000,
      }),
    };
  },
});
