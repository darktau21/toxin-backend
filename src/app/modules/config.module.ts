import { ConfigModule } from '@nestjs/config';

import { configLoaders } from '~/app/config';

export const configModule = ConfigModule.forRoot({
  cache: true,
  ignoreEnvFile: true,
  isGlobal: true,
  load: configLoaders,
});
