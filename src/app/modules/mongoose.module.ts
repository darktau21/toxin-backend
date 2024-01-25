import { MongooseModule } from '@nestjs/mongoose';

import { AppConfigService } from '~/config/app-config.service';

export const mongooseModule = MongooseModule.forRootAsync({
  inject: [AppConfigService],
  useFactory: (configService: AppConfigService) => {
    const {
      mongo: { database, host, password, port, replicaSet, user },
    } = configService.getDb();
    return {
      uri:
        !user || !password
          ? `mongodb://${host}:${port}/${database}?replicaSet=${replicaSet}`
          : `mongodb://${user}:${password}@${host}:${port}/${database}?authSource=admin&replicaSet=${replicaSet}`,
    };
  },
});
