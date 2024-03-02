import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AdminAccountConfigSchema,
  ConfigSchema,
  DatabasesConfigSchema,
  MailerConfigSchema,
  RequestsConfigSchema,
  SecurityConfigSchema,
  type S3ConfigSchema,
} from './schemas';

@Injectable()
export class AppConfigService {
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService<ConfigSchema>,
  ) {}

  getAdminAccount() {
    return this.configService.get<AdminAccountConfigSchema>('adminAccount');
  }

  getDb() {
    return this.configService.get<DatabasesConfigSchema>('db');
  }

  getMail() {
    return this.configService.get<MailerConfigSchema>('mail');
  }

  getSecurity() {
    return this.configService.get<SecurityConfigSchema>('security');
  }

  getRequests() {
    return this.configService.get<RequestsConfigSchema>('requests');
  }

  getS3() {
    return this.configService.get<S3ConfigSchema>('s3');
  }
}
