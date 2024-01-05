import { registerAs } from '@nestjs/config';

import { configSelector } from './config.loader';

export const dbConfigLoader = registerAs(
  'db',
  configSelector((config) => config.db),
);
