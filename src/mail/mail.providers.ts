import { Provider } from '@nestjs/common';
import { createTransport } from 'nodemailer';

import { AppConfigService } from '~/config/app-config.service';

export const MAIL_TRANSPORT = 'MAIL_TRANSPORT';

export const mailProviders: Provider[] = [
  {
    inject: [AppConfigService],
    provide: MAIL_TRANSPORT,
    useFactory: (configService: AppConfigService) => {
      const { host, name, password, port, secure, user } =
        configService.getMail();
      return createTransport(
        {
          auth: {
            pass: password,
            user,
          },
          debug: process.env.NODE_ENV === 'development',
          host,
          port,
          secure,
        },
        {
          from: {
            address: user,
            name,
          },
        },
      );
    },
  },
];
