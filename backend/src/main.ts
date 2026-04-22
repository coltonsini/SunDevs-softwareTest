import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: 'http://localhost:5173',
  });

  await app.listen(3000);
  console.log('Backend running at http://localhost:3000');
  console.log('Video endpoint: http://localhost:3000/api/videos');
}
bootstrap();
