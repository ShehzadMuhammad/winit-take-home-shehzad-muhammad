import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Config } from './common/constants/config';
import { JsonPrettyInterceptor } from './common/interceptors/json-pretty.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new JsonPrettyInterceptor());
  await app.listen(Config.PORT);
}
void bootstrap();
