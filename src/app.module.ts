import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// Modules applicatifs
import { AuthModule } from 'src/presentation/controllers/auth.module';
import { UserModule } from 'src/presentation/controllers/user.module';

@Module({
  imports: [
    // Chargement des variables d’environnement
    ConfigModule.forRoot({ isGlobal: true }),

    // Connexion à MongoDB avec configuration dynamique
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),

    // Modules fonctionnels
    AuthModule, // Gère l’authentification, contient JwtModule
    UserModule, // Gère les utilisateurs, dépend de JwtService via AuthModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Tu peux ajouter ici des middlewares globaux si nécessaire
    // Exemple : consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
