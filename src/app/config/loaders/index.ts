import { adminAccountConfigLoader } from './admin-account-config.loader';
import { dbConfigLoader } from './db-config.loader';
import { requestsConfigLoader } from './requests-config.loader';
import { securityConfigLoader } from './security-config.loader';
export const configLoaders = [
  dbConfigLoader,
  securityConfigLoader,
  adminAccountConfigLoader,
  requestsConfigLoader,
];
