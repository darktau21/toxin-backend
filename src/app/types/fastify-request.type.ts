import { ClientSession } from 'mongoose';

import { IAccessTokenData } from '~/auth/interfaces';

declare module 'fastify' {
  interface FastifyRequest {
    transaction?: ClientSession;
    user?: IAccessTokenData;
  }
}
