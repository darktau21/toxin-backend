import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { Connection } from 'mongoose';

import {
  AdminAccountConfig,
  AppConfigService,
  DbConfig,
  SecurityConfig,
} from '~/app/config';
import { Roles } from '~/user/schemas';

export const mongooseModule = MongooseModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: AppConfigService) => {
    const { mongo }: { mongo: DbConfig } = configService.get('db');
    const adminAccountConfig =
      configService.get<AdminAccountConfig>('adminAccount');
    const { passwordHashRounds } =
      configService.get<SecurityConfig>('security');
    return {
      connectionFactory: async (connection: Connection) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        connection.plugin(require('mongoose-autopopulate'));

        if (connection.readyState === 1) {
          const admin = await connection.db
            .collection('users')
            .findOne({ email: adminAccountConfig.email });
          if (!admin) {
            await connection.db.collection('users').insertOne({
              email: adminAccountConfig.email,
              isDeleted: false,
              password: await hash(
                adminAccountConfig.password,
                passwordHashRounds,
              ),
              role: Roles.ADMIN,
            });
          }
        }

        return connection;
      },
      uri:
        !mongo.user || !mongo.password
          ? `mongodb://${mongo.host}:${mongo.port}/${mongo.database}`
          : `mongodb://${mongo.user}:${mongo.password}@${mongo.host}:${mongo.port}/${mongo.database}?authSource=admin`,
    };
  },
});
