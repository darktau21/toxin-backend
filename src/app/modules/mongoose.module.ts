import { MongooseModule } from '@nestjs/mongoose';

import { AppConfigService } from '~/config/app-config.service';

export const mongooseModule = MongooseModule.forRootAsync({
  inject: [AppConfigService],
  useFactory: (configService: AppConfigService) => {
    const { mongo } = configService.getDb();
    return {
      uri:
        !mongo.user || !mongo.password
          ? `mongodb://${mongo.host}:${mongo.port}/${mongo.database}`
          : `mongodb://${mongo.user}:${mongo.password}@${mongo.host}:${mongo.port}/${mongo.database}?authSource=admin`,
    };
  },
});
