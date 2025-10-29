import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

// Contrôleur
import { AuthController } from './auth.controller';

// Cas d’usage et services
import { RegisterUserUseCase } from '../../application/use-cases/register-user.usecase';
import { JwtTokenService } from '../../infrastructure/jwt/jwt-token.service';
import { MailerService } from '../../infrastructure/mailer/mailer.service';
import { UserRepository } from '../../infrastructure/repositories/user.repository';

// Schéma Mongoose
import { User, UserSchema } from '../../infrastructure/database/user.schema';

// Garde d’authentification
import { AuthGuard } from '../guards/auth.guard';

@Module({
  imports: [
    // Chargement des variables d’environnement
    ConfigModule,

    // Configuration dynamique du module JWT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),

    // Enregistrement du schéma utilisateur dans Mongoose
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],

  controllers: [AuthController],

  providers: [
    RegisterUserUseCase,
    UserRepository,
    JwtTokenService,
    MailerService,
    AuthGuard,
  ],

  exports: [
    JwtTokenService,
    JwtModule, // Permet aux autres modules d’utiliser JwtService
  ],
})
export class AuthModule {}
