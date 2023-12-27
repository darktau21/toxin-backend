import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { AppConfigService } from '~/app/interfaces';
import { redisStore } from 'cache-manager-redis-yet';

export const cacheModuleConfig = CacheModule.registerAsync({
  inject: [ConfigService],
  isGlobal: true,
  useFactory: (configService: AppConfigService) => ({
    store: redisStore,
    url: configService.get('REDIS_CONNECTION_STRING', { infer: true }),
  }),
});
