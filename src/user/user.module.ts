import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MailModule } from '~/mail/mail.module';
import { MailService } from '~/mail/mail.service';
import { PublicUserController } from '~/user/public-user.controller';
import { User, UserSchema } from '~/user/schemas';
import { UserService } from '~/user/user.service';

@Module({
  controllers: [PublicUserController],
  exports: [UserService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MailModule,
  ],
  providers: [UserService, MailService],
})
export class UserModule {}
