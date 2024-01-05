import { SetMetadata } from '@nestjs/common';

import { Roles } from '~/user/schemas';

export const ROLES_METADATA_KEY = 'roles';
export const Role = (...roles: Roles[]) =>
  SetMetadata(ROLES_METADATA_KEY, roles);
