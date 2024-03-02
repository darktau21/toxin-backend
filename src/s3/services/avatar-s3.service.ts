import { Injectable, Scope } from '@nestjs/common';

import { S3BaseService } from './s3-base.service';

const AVATAR_BUCKET_NAME = 'avatars';

@Injectable({ scope: Scope.DEFAULT })
export class AvatarS3Service extends S3BaseService(AVATAR_BUCKET_NAME) {}
