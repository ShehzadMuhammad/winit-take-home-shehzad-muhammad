import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JsonPrettyInterceptor } from './common/interceptors/json-pretty.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new JsonPrettyInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
