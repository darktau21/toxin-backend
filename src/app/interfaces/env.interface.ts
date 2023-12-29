import { ConfigService } from '@nestjs/config';

export interface Env {
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  CACHE_TTL: string;
  COOKIE_SECRET: string;
  JWT_ACCESS_EXP_TIME: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_EXP_TIME: string;
  MONGO_CONNECTION_STRING: string;
  NODE_ENV: 'development' | 'production' | 'test';
  PASSWORD_HASH_ROUNDS: string;
  REDIS_CONNECTION_STRING: string;
}

export type AppConfigService = ConfigService<Env>;
