import { RedisModule } from '@songkeys/nestjs-redis';

import { AppConfigService } from '~/config/app-config.service';

export const REDIS_CACHE = 'redis:cacheDB';

export const redisModule = RedisModule.forRootAsync({
  inject: [AppConfigService],
  useFactory: (configService: AppConfigService) => {
    const { redis } = configService.getDb();
    return {
      config: [
        {
          db: 0,
          host: redis.host,
          namespace: REDIS_CACHE,
          password: redis.password,
          port: redis.port,
          username: redis.user,
        },
      ],
    };
  },
});
