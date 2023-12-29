import { cacheModuleConfig } from '~/app/config/cache-module.config';
import { configModuleConfig } from '~/app/config/config-module.config';
import { mongooseModuleConfig } from '~/app/config/mongoose-module.config';
import { redisModuleConfig } from '~/app/config/redis-module.config';

export const CONFIGS = [
  mongooseModuleConfig,
  configModuleConfig,
  cacheModuleConfig,
  redisModuleConfig,
];

export { REDIS_CACHE, REDIS_TOKENS } from './redis-module.config';
