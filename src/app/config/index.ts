import { cacheModuleConfig } from '~/app/config/cache-module.config';
import { configModuleConfig } from '~/app/config/config-module.config';
import { mongooseModuleConfig } from '~/app/config/mongoose-module.config';

export const CONFIGS = [
  mongooseModuleConfig,
  configModuleConfig,
  cacheModuleConfig,
];
