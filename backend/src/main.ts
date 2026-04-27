import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiKeyGuard } from './guards/api-key-guard';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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

  if (process.env.SWAGGER_ENABLED !== 'false') {
    const config = new DocumentBuilder()
      .setTitle('SunDevs API')
      .setDescription(
        'Cartelera de Conocimiento — API que transforma el payload crudo de YouTube en JSON limpio con un **Nivel de Hype** calculado.',
      )
      .setVersion('1.0')
      .addApiKey(
        { type: 'apiKey', in: 'header', name: 'x-api-key' },
        'x-api-key', 
      )
      .build();
 
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true, 
      },
    });
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log('Backend running at http://localhost:3000');
  console.log('Video endpoint: http://localhost:3000/api/videos');
  console.log(`Swagger: http://localhost:${port}/docs`);
}
bootstrap();
