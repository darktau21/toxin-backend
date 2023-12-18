import { Roles } from '~/user/schemas';

export interface IAccessTokenData {
  email: string;
  id: string;
  role: Roles;
}
