import { registerAs } from '@nestjs/config';

import { configSelector } from './config.loader';

export const securityConfigLoader = registerAs(
  'security',
  configSelector((config) => config.security),
);
