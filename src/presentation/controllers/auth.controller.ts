import {
  Controller,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { VerifyLoginOtpDto } from '../../application/dto/verify-login-otp.dto';
import { LoginDto } from '../../application/dto/login.dto';
import { ForgotPasswordDto } from '../../application/dto/forgot-password.dto';
import { ResetPasswordDto } from '../../application/dto/reset-password.dto';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.usecase';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { JwtTokenService } from '../../infrastructure/jwt/jwt-token.service';
import { MailerService } from '../../infrastructure/mailer/mailer.service';
import * as bcrypt from 'bcrypt';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtTokenService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Inscription d’un nouvel utilisateur' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Inscription réussie.' })
  @ApiResponse({ status: 400, description: 'Email déjà utilisé.' })
  async register(@Body() dto: CreateUserDto) {
    const existingUser = await this.userRepo.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('Cette adresse email est déjà utilisée.');
    }

    await this.registerUseCase.execute(dto);
    return {
      message:
        'Inscription réussie. Votre compte reste à approuver par un admin avant de vous connecter.',
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Connexion avec OTP (1ère fois uniquement)' })
  @ApiBody({ type: LoginDto })
  async login(@Body() body: LoginDto) {
    const user = await this.userRepo.findByEmail(body.email);
    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      throw new BadRequestException('Identifiants invalides');
    }

    if (!user.isEmailVerified || !user.isApprovedByAdmin || user.status !== 'active') {
      throw new BadRequestException('Compte non actif ou non vérifié');
    }

    if (user.hasLoggedInOnce) {
      const token = this.jwtService.generateToken({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        status: user.status,
      });
      return { token };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.userRepo.updateUser(body.email, { otpCode: otp, otpExpiresAt });
    await this.mailerService.sendOtpEmail(body.email, otp);

    return { message: 'OTP envoyé à votre email', email: body.email };
  }

  @Post('verify-login-otp')
  @ApiOperation({ summary: 'Vérification OTP et génération du token JWT' })
  @ApiBody({ type: VerifyLoginOtpDto })
  async verifyLoginOtp(@Body() dto: VerifyLoginOtpDto) {
    const user = await this.userRepo.verifyLoginOtp(dto.email, dto.code);

    await this.userRepo.updateUser(dto.email, { hasLoggedInOnce: true });

    const token = this.jwtService.generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      status: user.status,
    });

    return { token };
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Demande de code de réinitialisation' })
  @ApiBody({ type: ForgotPasswordDto })
  async requestResetPassword(@Body() dto: ForgotPasswordDto) {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) throw new BadRequestException('Email introuvable');

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.userRepo.updateUser(dto.email, {
      resetCode,
      otpExpiresAt: expiresAt,
    });

    await this.mailerService.sendResetPasswordEmail(dto.email, resetCode);

    return { message: 'Code de réinitialisation envoyé par email' };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Définir un nouveau mot de passe avec un code' })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || user.resetCode !== dto.resetCode) {
      throw new BadRequestException('Code invalide ou email incorrect');
    }

    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
      throw new BadRequestException('Code expiré');
    }

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepo.updateUser(dto.email, {
      password: hashed,
      resetCode: undefined,
      otpExpiresAt: undefined,
    });

    return { message: 'Mot de passe mis à jour avec succès' };
  }
}
