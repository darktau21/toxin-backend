import { FastifyCookieOptions } from '@fastify/cookie';
import fastifyCookiePlugin from '@fastify/cookie';
import fastifyMultipart from '@fastify/multipart';
import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { resolve } from 'path';
import * as process from 'process';

import { AppModule } from '~/app/app.module';
import { generateMermaidGraph } from '~/app/utils';
import { AppConfigService } from '~/config/app-config.service';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      trustProxy: '127.0.0.1',
    }),
  );

  if (process.env.NODE_ENV === 'development') {
    generateMermaidGraph(app);
  }

  const configService = app.get(AppConfigService);
  if (process.env.NODE_ENV === 'development') {
    app.useLogger(console);
  }

  app.useStaticAssets({ root: resolve(__dirname, '..', 'public') });

  const { cookieSecret } = configService.getSecurity();

  // @ts-expect-error incompatible plugin type
  await app.register(fastifyCookiePlugin, {
    secret: cookieSecret,
  } satisfies FastifyCookieOptions);
  // @ts-expect-error incompatible plugin type
  await app.register(fastifyMultipart, { attachFieldsToBody: true });

  app.enableVersioning({ defaultVersion: '1', type: VersioningType.URI });

  const config = new DocumentBuilder()
    .addBearerAuth({
      description: 'Введите access token в поле в виде "Bearer {токен}"',
      in: 'header',
      name: 'Authorization',
      type: 'apiKey',
    })
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
