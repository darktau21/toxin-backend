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
