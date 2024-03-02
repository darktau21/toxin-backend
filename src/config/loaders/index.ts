import { adminAccountConfigLoader } from './admin-account-config.loader';
import { dbConfigLoader } from './db-config.loader';
import { mailerConfigLoader } from './mailer-config.loader';
import { requestsConfigLoader } from './requests-config.loader';
import { s3ConfigLoader } from './s3-config.loader';
import { securityConfigLoader } from './security-config.loader';
export const configLoaders = [
  dbConfigLoader,
  securityConfigLoader,
  adminAccountConfigLoader,
  requestsConfigLoader,
  mailerConfigLoader,
  s3ConfigLoader,
];
