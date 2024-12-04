import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

async function bootstrap() {
  // load env vars
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  // use cookie-parser middleware
  app.use(cookieParser());

  // Enable CORS for the frontend
  app.enableCors({
    origin: 'http://localhost:8080', // frontend URL
    credentials: true, // allow cookies
  });

  await app.listen(3000);
}
bootstrap();
