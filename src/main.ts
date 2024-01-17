import { FastifyCookieOptions } from '@fastify/cookie';
import fastifyCookiePlugin from '@fastify/cookie';
import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationError, useContainer } from 'class-validator';
import * as process from 'process';

import { AppModule } from '~/app/app.module';
import { HttpExceptionFilter } from '~/app/filters';
import { ResponseWrapperInterceptor } from '~/app/interceptors';
import { ParseQueryPipe } from '~/app/pipes';

import { AppConfigService } from './config/app-config.service';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      trustProxy: '127.0.0.1',
    }),
  );

  const configService: AppConfigService = app.get(AppConfigService);
  if (process.env.NODE_ENV === 'development') {
    app.useLogger(console);
  }

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ParseQueryPipe(),
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[]) => {
        const errors: Record<string, string[]> = {};

        validationErrors.forEach((validationError) => {
          errors[validationError.property] = Object.values(
            validationError.constraints,
          );
        });

        throw new BadRequestException(errors);
      },
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new ResponseWrapperInterceptor(),
  );

  const { cookieSecret } = configService.getSecurity();

  // @ts-expect-error incompatible plugin type
  await app.register(fastifyCookiePlugin, {
    secret: cookieSecret,
  } satisfies FastifyCookieOptions);

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
