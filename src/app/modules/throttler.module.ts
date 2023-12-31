// import { ThrottlerModule } from '@nestjs/throttler';
// import { ConfigService } from '@nestjs/config';
// import { AppConfigService } from '~/app/schemas';
//
// export const throttlerModuleConfig = ThrottlerModule.forRootAsync({
//   inject: [ConfigService],
//   useFactory: (configService: AppConfigService) => ([{
//     ttl: configService.get('THROTTLE_TIME')
//   },
//   ]),
// });
