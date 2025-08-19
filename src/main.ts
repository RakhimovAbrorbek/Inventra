import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function start() {
  const PORT = process.env.PORT || 3000
  const app = await NestFactory.create(AppModule, { logger: ["debug", "error"] });
  app.use(cookieParser(process.env.COOKIE_SECRET))
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.setGlobalPrefix("api")
  await app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
}
start();


