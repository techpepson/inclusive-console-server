import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { configDotenv } from 'dotenv';

async function bootstrap() {
  configDotenv();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: [
      'https://inclusive-console.sbuildsolutions.org',
      'https://inclusive.sbuildsolutions.org/',
      'http://localhost:3000',
      'http://localhost:5174',
      'http://localhost:5173',
      'http://localhost:5175',
    ],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
      'Access-Control-Allow-Origin',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
