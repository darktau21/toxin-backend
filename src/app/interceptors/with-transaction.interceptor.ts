import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { FastifyRequest } from 'fastify';
import { Connection } from 'mongoose';
import { Observable, catchError, concatMap, finalize } from 'rxjs';

@Injectable()
export class WithTransactionInterceptor implements NestInterceptor {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const session = await this.connection.startSession();
    session.startTransaction();

    const req = context.switchToHttp().getRequest<FastifyRequest>();
    req.transaction = session;

    return next.handle().pipe(
      concatMap(async (data) => {
        await session.commitTransaction();
        return data;
      }),
      catchError(async (err) => {
        await session.abortTransaction();
        throw err;
      }),
      finalize(async () => {
        await session.endSession();
      }),
    );
  }
}
