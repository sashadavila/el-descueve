import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //  CORS habilitado
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  });

  //  Middleware de logging global
  app.use(new LoggerMiddleware().use);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('El Descueve API')
    .setDescription(`
## Documentación de la API del ecommerce

### Autenticación:
1. Registrarse en \`/auth/register\`
2. Login en \`/auth/login\` para obtener el token
3. Usar el token en el botón "Authorize" (arriba) con formato: \`Bearer <token>\`

### Roles:
- **admin**: Acceso total
- **client**: Acceso a rutas protegidas básicas
        `)
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`\n🚀 Servidor corriendo en: http://localhost:${port}`);
  console.log(`📚 Documentación Swagger: http://localhost:${port}/api/docs`);
  console.log(`🔐 Rutas protegidas requieren token JWT\n`);
}

bootstrap();