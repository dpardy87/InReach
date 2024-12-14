import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // load default .env
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  // ensure all endpoints are protected from receiving incorrect data
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // use cookie-parser middleware
  app.use(cookieParser());

  // helmet sets security-related HTTP headers
  app.use(helmet());

  // Enable CORS for the frontend
  app.enableCors({
    origin: 'http://localhost:8080', // frontend URL
    credentials: true, // allow cookies
  });

  await app.listen(3000);
}
bootstrap();
