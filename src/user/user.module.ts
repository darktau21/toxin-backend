import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MailModule } from '~/mail/mail.module';
import { RoleGuard } from '~/user/guards';
import { PublicUserController } from '~/user/public-user.controller';
import { User, UserSchema } from '~/user/schemas';
import { UserService } from '~/user/user.service';

import { EmailController } from './email.controller';

@Module({
  controllers: [PublicUserController, EmailController],
  exports: [UserService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MailModule,
  ],
  providers: [UserService, RoleGuard],
})
export class UserModule {}
