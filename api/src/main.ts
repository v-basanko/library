import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HTTP_PORT } from './config/application';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(HTTP_PORT);
}
bootstrap();
