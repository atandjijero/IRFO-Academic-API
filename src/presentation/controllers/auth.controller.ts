import {
  Controller,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { VerifyOtpDto } from '../../application/dto/verify-otp.dto';
import { LoginDto } from '../../application/dto/login.dto';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.usecase';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { JwtTokenService } from '../../infrastructure/jwt/jwt-token.service';
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
    private readonly jwtService: JwtTokenService
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Inscription d’un nouvel utilisateur' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Inscription réussie. Vérifiez votre email.' })
  async register(@Body() dto: CreateUserDto) {
    await this.registerUseCase.execute(dto);
    return { message: 'Inscription réussie. Vérifiez votre email.' };
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Vérification du code OTP reçu par email' })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({ status: 200, description: 'Email vérifié avec succès.' })
  @ApiResponse({ status: 400, description: 'Code OTP invalide ou expiré.' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    const success = await this.userRepo.verifyOtp(dto.email, dto.code);
    if (!success) {
      throw new BadRequestException('Code OTP invalide ou expiré');
    }
    return { message: 'Email vérifié. En attente de validation admin.' };
  }

  @Post('login')
  @ApiOperation({ summary: 'Connexion de l’utilisateur' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Connexion réussie. Token JWT retourné.' })
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

    const token = this.jwtService.generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return { token };
  }
}
