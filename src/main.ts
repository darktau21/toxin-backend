import { FastifyCookieOptions, fastifyCookie } from '@fastify/cookie';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

import { AppModule } from '~/app.module';
import { AppConfigService } from '~/env.interface';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const configService: AppConfigService = app.get(ConfigService);
  if (configService.get('NODE_ENV', { infer: true }) === 'development') {
    app.useLogger(console);
  }

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.register(fastifyCookie, {
    secret: configService.get('COOKIE_SECRET'),
  } satisfies FastifyCookieOptions);

  app.enableVersioning({ defaultVersion: '1', type: VersioningType.URI });

  const config = new DocumentBuilder()
    .setTitle('Toxin')
    .setDescription('Документация по api')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3000, '0.0.0.0');

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
