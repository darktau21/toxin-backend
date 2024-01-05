import { registerAs } from '@nestjs/config';

import { configSelector } from './config.loader';

export const requestsConfigLoader = registerAs(
  'requests',
  configSelector((config) => config.requests),
);
