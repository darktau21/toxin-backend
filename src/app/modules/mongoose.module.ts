import { MongooseModule } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { Connection } from 'mongoose';

import { AppConfigService } from '~/config/app-config.service';
import { Roles } from '~/user/schemas';

export const mongooseModule = MongooseModule.forRootAsync({
  inject: [AppConfigService],
  useFactory: (configService: AppConfigService) => {
    const { mongo } = configService.getDb();
    const adminAccountConfig = configService.getAdminAccount();
    const { passwordHashRounds } = configService.getSecurity();
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
