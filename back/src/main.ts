// main.ts - Versión corregida con filtro de excepciones
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  // Usar NestExpressApplication para tener acceso a useStaticAssets
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Servir archivos estáticos desde la carpeta uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // CORS habilitado
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  });

  // MIDDLEWARE DE LOGGING DIRECTO (sin archivo externo)
  app.use((req, res, next) => {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const authHeader = req.get('authorization') || 'No token';
    const startTime = Date.now();

    console.log(`📥 [${new Date().toISOString()}] ${method} ${originalUrl}`);
    console.log(`📋 Authorization: ${authHeader.substring(0, 50)}...`);

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;
      console.log(`📤 [${new Date().toISOString()}] ${method} ${originalUrl} ${statusCode} ${duration}ms`);
    });

    next();
  });

  // ✅ Agregar filtro de excepciones ANTES del ValidationPipe para ver errores
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        console.log('❌❌❌ VALIDATION ERRORS DETAIL ❌❌❌');
        console.log(JSON.stringify(errors, null, 2));
        return new BadRequestException(errors);
      },
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
  console.log(`🔐 Rutas protegidas requieren token JWT`);
  console.log(`📊 Logging de peticiones activado\n`);
  console.log(`📁 Archivos subidos disponibles en: http://localhost:${port}/uploads/`);
}

bootstrap();