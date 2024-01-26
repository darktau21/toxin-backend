import { IRefreshTokenData } from './refresh-token-data.interface';

export interface ITokens {
  accessToken: string;
  refreshToken: string;
  refreshTokenData: IRefreshTokenData;
}
