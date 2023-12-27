import { ConfigModule } from '@nestjs/config';

export const configModuleConfig = ConfigModule.forRoot({
  cache: true,
  ignoreEnvFile: true,
  isGlobal: true,
});
