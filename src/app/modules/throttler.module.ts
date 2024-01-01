import { ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppConfigService, RequestsConfig } from '~/app/config';

export const throttlerModuleConfig = ThrottlerModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: AppConfigService) => {
    const { limit, throttle } = configService.get<RequestsConfig>('requests');
    return [
      {
        limit,
        ttl: throttle * 1000,
      },
    ];
  },
});
