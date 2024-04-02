import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'log', 'warn']
  });

  app.enableCors({
    "origin": ["*"],
    "methods": ["GET","HEAD","PUT","POST","DELETE", "OPTIONS"]
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    })
  );

  app.setGlobalPrefix('api');

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
