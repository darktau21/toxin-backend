import { CacheModule } from '@nestjs/cache-manager';
import { RedisService } from '@songkeys/nestjs-redis';
import { redisInsStore } from 'cache-manager-ioredis-yet';

import { REDIS_CACHE } from '~/app/modules/redis.module';
import { AppConfigService } from '~/config/app-config.service';

export const cacheModule = CacheModule.registerAsync({
  inject: [RedisService, AppConfigService],
  isGlobal: true,
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
