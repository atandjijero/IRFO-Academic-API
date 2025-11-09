import {
  Controller,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { VerifyOtpDto } from '../../application/dto/verify-otp.dto';
import { VerifyLoginOtpDto } from '../../application/dto/verify-login-otp.dto';
import { LoginDto } from '../../application/dto/login.dto';
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
  @ApiResponse({ status: 201, description: 'Inscription réussie. Vérifiez votre email.' })
  @ApiResponse({ status: 400, description: 'Email déjà utilisé.' })
  async register(@Body() dto: CreateUserDto) {
    const existingUser = await this.userRepo.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('Cette adresse email est déjà utilisée. Veuillez en choisir une autre.');
    }

    await this.registerUseCase.execute(dto);
    return { message: 'Inscription réussie. Vérifiez votre email.' };
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Vérification du code OTP reçu par email (inscription)' })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({ status: 200, description: 'Email vérifié avec succès.' })
  @ApiResponse({ status: 400, description: 'Code OTP invalide ou expiré.' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    const success = await this.userRepo.verifyOtp(dto.email, dto.code);
    if (!success) {
      throw new BadRequestException('Code OTP invalide ou expiré');
    }

    return { message: 'Email vérifié. En attente de validation par l’admin.' };
  }

  @Post('login')
  @ApiOperation({ summary: 'Connexion de l’utilisateur avec envoi OTP' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'OTP envoyé. Vérifiez votre email.' })
  @ApiResponse({ status: 400, description: 'Identifiants invalides ou compte non vérifié.' })
  async login(@Body() body: LoginDto) {
    const user = await this.userRepo.findByEmail(body.email);
    if (!user) {
      throw new BadRequestException('Utilisateur introuvable');
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Mot de passe incorrect');
    }

    if (!user.isEmailVerified) {
      throw new BadRequestException('Email non vérifié');
    }

    if (!user.isApprovedByAdmin) {
      throw new BadRequestException('Compte non approuvé par l’admin');
    }

    if (user.status === 'blocked') {
      throw new BadRequestException('Compte bloqué par l’administration');
    }

    if (user.status === 'inactive') {
      throw new BadRequestException('Compte inactif. Veuillez contacter l’administration.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await this.userRepo.updateUser(body.email, {
      otpCode: otp,
      otpExpiresAt,
    });

    await this.mailerService.sendOtpEmail(body.email, otp);

    return {
      message: 'OTP envoyé à votre adresse email. Veuillez le vérifier pour continuer.',
      email: body.email,
    };
  }

  @Post('verify-login-otp')
  @ApiOperation({ summary: 'Vérification OTP après login et génération du token JWT' })
  @ApiBody({ type: VerifyLoginOtpDto })
  @ApiResponse({ status: 200, description: 'Connexion réussie. Token JWT retourné.' })
  @ApiResponse({ status: 400, description: 'OTP invalide ou expiré.' })
  async verifyLoginOtp(@Body() dto: VerifyLoginOtpDto) {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new BadRequestException('Utilisateur introuvable');
    }

    if (user.otpCode !== dto.code) {
      throw new BadRequestException('Code OTP invalide');
    }

    if (!user.otpExpiresAt || new Date() > user.otpExpiresAt) {
      throw new BadRequestException('Code OTP expiré');
    }

    if (!user.isApprovedByAdmin || user.status !== 'active') {
      throw new BadRequestException('Compte non actif ou non approuvé');
    }

    await this.userRepo.updateUser(dto.email, {
      otpCode: undefined,
      otpExpiresAt: undefined,
    });

    const token = this.jwtService.generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      status: user.status,
    });

    return { token };
  }
}
