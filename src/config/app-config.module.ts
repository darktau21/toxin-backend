import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configLoaders } from './loaders';
import { AppConfigService } from './app-config.service';
import { AppConfigStatic } from './app-config.static';

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
  providers: [AppConfigService, AppConfigStatic],
  exports: [AppConfigService],
})
export class AppConfigModule {}
