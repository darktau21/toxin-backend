import { ConfigService } from '@nestjs/config';

import { Config } from './schemas';

export type AppConfigService = ConfigService<Config>;
