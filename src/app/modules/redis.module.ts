import { RedisModule } from '@songkeys/nestjs-redis';

import { AppConfigService } from '~/config/app-config.service';

export const REDIS_CACHE = 'cacheDB';
export const REDIS_TOKENS = 'tokensDB';
export const REDIS_EMAILS = 'emailsDB';

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
        {
          db: 1,
          host: redis.host,
          namespace: REDIS_TOKENS,
          password: redis.password,
          port: redis.port,
          username: redis.user,
        },
        {
          db: 2,
          host: redis.host,
          namespace: REDIS_EMAILS,
          password: redis.password,
          port: redis.port,
          username: redis.user,
        },
      ],
    };
  },
});
