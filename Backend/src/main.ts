import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Required for Stripe webhook signature verification
  });

  // Security headers
  app.use(helmet());

  // CORS — allow only the Next.js frontend origin
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: [
      'https://fixit-beige.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation — strips unknown fields, transforms types
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global route prefix
  // Rewrite requests from TestSprite AI that drop the /api/v1 prefix
  app.use((req, res, next) => {
    if (!req.url.startsWith('/api/v1') && !req.url.startsWith('/stripe')) {
      req.url = `/api/v1${req.url}`;
    }
    next();
  });

  app.setGlobalPrefix('api/v1');

  const port = configService.get<number>('PORT', 3001);
  await app.listen(port, '0.0.0.0');

  console.log(`🔧 FixIt API running on port ${port}`);
}
bootstrap();
