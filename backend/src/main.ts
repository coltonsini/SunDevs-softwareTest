import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiKeyGuard } from './guards/api-key-guard';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());

  app.setGlobalPrefix('api');
  app.useGlobalGuards(new ApiKeyGuard());

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET'],
    allowedHeaders: ['x-api-key'],
  });

  await app.listen(3000);
  console.log('Backend running at http://localhost:3000');
  console.log('Video endpoint: http://localhost:3000/api/videos');
}
bootstrap();
