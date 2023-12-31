import { Module } from '@nestjs/common';
import { dynamicModules } from 'src/app/modules';

import { AuthModule } from '~/auth/auth.module';
import { UserModule } from '~/user/user.module';

@Module({
  imports: [UserModule, AuthModule, ...dynamicModules],
})
export class AppModule {}
