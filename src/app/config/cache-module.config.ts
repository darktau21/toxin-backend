import { CacheModule } from '@nestjs/cache-manager';
import { redisInsStore } from 'cache-manager-ioredis-yet';
import { RedisService } from '@songkeys/nestjs-redis';
import { REDIS_CACHE } from '~/app/config/redis-module.config';
import { ConfigService } from '@nestjs/config';
import { AppConfigService } from '~/app/interfaces';

export const cacheModuleConfig = CacheModule.registerAsync({
  inject: [RedisService, ConfigService],
  isGlobal: true,
  useFactory: async (redisService: RedisService, configService: AppConfigService, ) => ({
    store: redisInsStore(redisService.getClient(REDIS_CACHE), {
      ttl: +configService.get('CACHE_TTL') * 1000
    }),
  }),
});
