import { registerAs } from '@nestjs/config';

import { configSelector } from './config.loader';

export const mailerConfigLoader = registerAs(
  'mail',
  configSelector((config) => config.mail),
);
