import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { AdminAccountConfigSchema } from './admin-account-config.schema';
import { DbConfigSchema } from './db-config.schema';
import { RequestsConfigSchema } from './requests-config.schema';
import { SecurityConfigSchema } from './security-config.schema';
import { MailerConfigSchema } from './mailer-config.schema';
import { S3ConfigSchema } from './s3-config.schema';

export class DatabasesConfigSchema {
  @ValidateNested()
  @Type(() => DbConfigSchema)
  mongo: DbConfigSchema;

  @ValidateNested()
  @Type(() => DbConfigSchema)
  redis: DbConfigSchema;
}

export class ConfigSchema {
  @ValidateNested()
  @Type(() => AdminAccountConfigSchema)
  adminAccount: AdminAccountConfigSchema;

  @ValidateNested()
  @Type(() => DatabasesConfigSchema)
  db: DatabasesConfigSchema;

  @ValidateNested()
  @Type(() => RequestsConfigSchema)
  requests: RequestsConfigSchema;

  @ValidateNested()
  @Type(() => SecurityConfigSchema)
  security: SecurityConfigSchema;

  @ValidateNested()
  @Type(() => MailerConfigSchema)
  mail: MailerConfigSchema;

  @ValidateNested()
  @Type(() => S3ConfigSchema)
  s3: S3ConfigSchema;
}
