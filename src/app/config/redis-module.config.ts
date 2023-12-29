import { RedisModule } from '@songkeys/nestjs-redis';
import { ConfigService } from '@nestjs/config';
import { AppConfigService } from '~/app/interfaces';

export const REDIS_CACHE = 'cacheDB';
export const REDIS_TOKENS = 'tokensDB';

export const redisModuleConfig = RedisModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: AppConfigService) => ({
    config: [
      {
        namespace: REDIS_CACHE,
        url: `${configService.get('REDIS_CONNECTION_STRING')}/0`,
      },
      {
        namespace: REDIS_TOKENS,
        url: `${configService.get('REDIS_CONNECTION_STRING')}/1`,
      },
    ],
  }),
});
