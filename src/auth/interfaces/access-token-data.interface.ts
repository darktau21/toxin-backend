import { Roles } from '~/user/interfaces';

export interface IAccessTokenData {
  email: string;
  id: string;
  role: Roles;
}
