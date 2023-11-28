// Internal imports
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// Usando @nestjs/config para cargar variables de entorno
import { ConfigService } from '@nestjs/config';

// Own imports
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Docs
  const config = new DocumentBuilder()
    .setTitle('API REST - TOKENIZACION DE TARJETAS')
    .setDescription('Documentación de apis')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || app.get(ConfigService).get('PORT'));
}

bootstrap();
