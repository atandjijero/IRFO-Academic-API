import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.usecase';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { JwtTokenService } from '../../infrastructure/jwt/jwt-token.service';
import { MailerService } from '../../infrastructure/mailer/mailer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../infrastructure/database/user.schema';
import { AuthGuard } from '../guards/auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
  exports: [JwtTokenService, JwtModule], //  export du JwtModule
})
export class AuthModule {}
