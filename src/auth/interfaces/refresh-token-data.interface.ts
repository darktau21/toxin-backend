import { IUser } from '~/user/interfaces';

import { IFingerprint } from './fingerprint.interface';

export const REFRESH_TOKEN_COOKIE = 'refreshToken';

export interface IRefreshTokenData {
  expiresIn: Date;
  fingerprint: IFingerprint;
  refreshToken?: string;
  user: IUser;
}
