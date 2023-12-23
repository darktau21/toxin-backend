import { IFingerprint } from './fingerprint.interface';

export const REFRESH_TOKEN_COOKIE = 'refreshToken';

export interface IRefreshTokenData {
  expiresIn: number;
  fingerprint: IFingerprint;
  refreshToken: string;
  userId: string;
}
