import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

async function bootstrap() {
  //  Chargement des variables d’environnement
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  //  Activation du CORS pour les appels cross-origin
  app.enableCors();

  //  Validation globale des DTOs avec nettoyage des propriétés non attendues
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // supprime les propriétés non déclarées dans les DTOs
      forbidNonWhitelisted: true, // optionnel : rejette les requêtes avec des champs non autorisés
      transform: true, // transforme les types automatiquement (ex: string → number)
    })
  );

  // Configuration Swagger pour la documentation de l’API
  const swaggerConfig = new DocumentBuilder()
    .setTitle('IRFO Academic API / JEROME')
    .setDescription('Documentation des endpoints de l’API IRFO')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Entrez le token JWT ici',
      },
      'access-token'
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // conserve le token entre les requêtes Swagger
    },
  });


  const port = process.env.PORT || 9000;
  await app.listen(port);
  console.log(` Application lancée sur http://localhost:${port}/api`);
}

bootstrap();
