import { IFingerprint } from './fingerprint.interface';

export interface IRefreshTokenData {
  expiresIn: number;
  fingerprint: IFingerprint;
  refreshToken: string;
  userId: string;
}
