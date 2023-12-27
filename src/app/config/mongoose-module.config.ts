import { ConfigService } from '@nestjs/config';
import { AppConfigService } from '~/app/interfaces';
import { Connection } from 'mongoose';
import { Roles } from '~/user/schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { hash } from 'bcrypt';

export const mongooseModuleConfig = MongooseModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: AppConfigService) => ({
    connectionFactory: async (connection: Connection) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      connection.plugin(require('mongoose-autopopulate'));

      if (connection.readyState === 1) {
        const admin = await connection.db
          .collection('users')
          .findOne({ email: configService.get('ADMIN_EMAIL') });
        if (!admin) {
          await connection.db.collection('users').insertOne({
            email: configService.get('ADMIN_EMAIL'),
            password: await hash(
              configService.get('ADMIN_PASSWORD'),
              +configService.get('PASSWORD_HASH_ROUNDS', 12),
            ),
            role: Roles.ADMIN,
          });
        }
      }

      return connection;
    },
    uri: configService.get('MONGO_CONNECTION_STRING'),
  }),
});
