import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { JSONAPIInterceptor } from './shared/interceptors/jsonapi.interseptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: /^http:\/\/localhost:\d+/,
      credentials: true,
    },
  });
  const config = new DocumentBuilder()
    .setTitle('hillel API')
    .addBearerAuth({ in: 'header', type: 'http', bearerFormat: 'JWT' })
    .build();

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new JSONAPIInterceptor());

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
