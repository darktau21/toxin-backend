import { registerAs } from '@nestjs/config';
import { configSelector } from './config.loader';

export const s3ConfigLoader = registerAs(
  's3',
  configSelector((config) => config.s3),
);
