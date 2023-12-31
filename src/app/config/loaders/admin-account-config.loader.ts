import { registerAs } from '@nestjs/config';

import { configSelector } from './config.loader';

export const adminAccountConfigLoader = registerAs(
  'adminAccount',
  configSelector((config) => config.adminAccount),
);
