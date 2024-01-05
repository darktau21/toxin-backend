import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configLoaders } from './loaders';
import { AppConfigService } from './app-config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      ignoreEnvFile: true,
      isGlobal: false,
      load: configLoaders,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
