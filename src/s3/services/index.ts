import type { Provider } from '@nestjs/common';

import { AvatarS3Service } from './avatar-s3.service';
import { S3BaseService } from './s3-base.service';

export const s3Services: Provider[] = [AvatarS3Service];

export { AvatarS3Service, S3BaseService };
