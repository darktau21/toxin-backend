import { cacheModule } from './cache.module';
import { mongooseModule } from './mongoose.module';
import { redisModule } from './redis.module';
import { throttlerModuleConfig } from './throttler.module';

export const dynamicModules = [
  mongooseModule,
  cacheModule,
  redisModule,
  throttlerModuleConfig,
];

export { REDIS_CACHE } from './redis.module';
