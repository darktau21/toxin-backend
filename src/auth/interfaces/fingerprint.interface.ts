import { Lookup } from 'geoip-lite';

export interface IFingerprint {
  ip: string;
  location?: Lookup;
  userAgent?: string;
}
