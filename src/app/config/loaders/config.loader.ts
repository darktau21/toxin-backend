import { Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, validateSync } from 'class-validator';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';
import * as process from 'process';

import { Config } from '~/app/config';

const configLoader = <T>(configPath: string) => {
  let cache: T;

  return (selector: (config: T) => unknown) => {
    if (!cache) {
      cache = yaml.load(
        fs.readFileSync(path.resolve(configPath), 'utf-8'),
      ) as T;
      const validationResult = validateSync(plainToInstance(Config, cache));

      if (validationResult.length !== 0) {
        const logger = new Logger('ConfigLoader');

        logger.fatal(validationResult);
        process.exit(1);
      }
    }
    return () => selector(cache);
  };
};

export const configSelector = configLoader<Config>(process.env.CONFIG_PATH);
