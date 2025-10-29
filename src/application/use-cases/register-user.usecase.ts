import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { MailerService } from '../../infrastructure/mailer/mailer.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly mailerService: MailerService,
  ) {}

  async execute(dto: CreateUserDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Les mots de passe ne correspondent pas');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const user = await this.userRepo.createUser({
      ...dto,
      password: hashedPassword,
      otpCode: otp,
      otpExpiresAt,
      isEmailVerified: false,
      isApprovedByAdmin: false,
      role: dto.role ?? 'etudiant', // rôle par défaut si non fourni
      status: dto.status ?? 'actif', // statut par défaut si non fourni
    });

    try {
      await this.mailerService.sendOtpEmail(dto.email, otp);
    } catch (error) {
      throw new InternalServerErrorException('Utilisateur créé, mais échec de l’envoi de l’OTP');
    }

    return user;
  }
}
