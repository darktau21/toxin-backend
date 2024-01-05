import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { AdminAccountConfig } from './admin-account-config.schema';
import { DbConfig } from './db-config.schema';
import { RequestsConfig } from './requests-config.schema';
import { SecurityConfig } from './security-config.schema';
import { MailerConfig } from './mailer-config.schema';

class DatabasesConfig {
  @ValidateNested()
  @Type(() => DbConfig)
  mongo: DbConfig;

  @ValidateNested()
  @Type(() => DbConfig)
  redis: DbConfig;
}

export class Config {
  @ValidateNested()
  @Type(() => AdminAccountConfig)
  adminAccount: AdminAccountConfig;

  @ValidateNested()
  @Type(() => DatabasesConfig)
  db: DatabasesConfig;

  @ValidateNested()
  @Type(() => RequestsConfig)
  requests: RequestsConfig;

  @ValidateNested()
  @Type(() => SecurityConfig)
  security: SecurityConfig;

  @ValidateNested()
  @Type(() => MailerConfig)
  mail: MailerConfig;
}
