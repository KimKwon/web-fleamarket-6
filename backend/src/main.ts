import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { SocketIoAdaptor } from './domain/chat/chat.adaptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useWebSocketAdapter(new SocketIoAdaptor(app));
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
  });
  await app.listen(4000);
}
bootstrap();
