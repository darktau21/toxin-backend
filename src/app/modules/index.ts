import { cacheModule } from './cache.module';
import { configModule } from './config.module';
import { mongooseModule } from './mongoose.module';
import { redisModule } from './redis.module';

export const dynamicModules = [
  mongooseModule,
  configModule,
  cacheModule,
  redisModule,
];

export { REDIS_CACHE, REDIS_TOKENS } from './redis.module';
