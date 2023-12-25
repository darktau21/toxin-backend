import { Module } from '@nestjs/common';

import { CONFIGS } from '~/app/config';
import { AuthModule } from '~/auth/auth.module';
import { UserModule } from '~/user/user.module';

@Module({
  imports: [UserModule, AuthModule, ...CONFIGS],
})
export class AppModule {}
