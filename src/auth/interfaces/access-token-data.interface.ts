import { Roles } from '~/user';

export interface IAccessTokenData {
  email: string;
  id: string;
  role: Roles;
}
