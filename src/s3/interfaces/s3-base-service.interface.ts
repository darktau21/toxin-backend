import type { PutObjectCommandOutput } from '@aws-sdk/client-s3';
import type { MemoryStorageFile } from '@blazity/nest-file-fastify';

export interface IS3BaseService {
  put(key: string, file: MemoryStorageFile): Promise<PutObjectCommandOutput>;
}
