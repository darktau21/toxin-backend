import { ThrottlerModule } from '@nestjs/throttler';

import { AppConfigService } from '~/config/app-config.service';

export const throttlerModuleConfig = ThrottlerModule.forRootAsync({
  inject: [AppConfigService],
  useFactory: (configService: AppConfigService) => {
    const { limit, throttle } = configService.getRequests();
    return [
      {
        limit,
        ttl: throttle * 1000,
      },
    ];
  },
});
