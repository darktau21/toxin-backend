import { ClientSession } from 'mongoose';

import { IUser } from '~/user/interfaces';

declare module 'fastify' {
  interface FastifyRequest {
    transaction?: ClientSession;
    user?: IUser;
  }
}
