import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.usecase';
import { JwtTokenService } from '../../infrastructure/jwt/jwt-token.service';
import { MailerService } from '../../infrastructure/mailer/mailer.service';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { HistoryModule } from 'src/presentation/controllers/history.module';
import { User, UserSchema } from '../../infrastructure/database/user.schema';
import { AuthGuard } from '../guards/auth.guard';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ Assure le chargement global des variables .env

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // ✅ Doit être défini dans .env
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),

    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    forwardRef(() => HistoryModule), // ✅ Résout la dépendance circulaire si History utilise Auth
  ],

  controllers: [AuthController],

  providers: [
    RegisterUserUseCase,
    UserRepository,
    JwtTokenService,
    MailerService,
    AuthGuard,
    Reflector,
  ],

  exports: [
    JwtTokenService,
    JwtModule,
    AuthGuard,
  ],
})
export class AuthModule {}
