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


import { User, UserSchema } from '../../infrastructure/database/user.schema';


import { AuthGuard } from '../guards/auth.guard';

@Module({
  imports: [
    
    ConfigModule,

    
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),

    
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
    JwtModule, 
  ],
})
export class AuthModule {}
