import { Exclude, Expose } from 'class-transformer';

import { ITokens } from '../interfaces';

@Exclude()
export class AccessTokenResponse implements Partial<ITokens> {
  @Expose()
  accessToken: string;

  constructor(tokens: ITokens) {
    Object.assign(this, tokens);
  }
}
