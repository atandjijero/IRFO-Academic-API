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
    // Validate password confirmation
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Generate OTP and expiration
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Create the user
    const user = await this.userRepo.createUser({
      ...dto,
      password: hashedPassword,
      otpCode: otp,
      otpExpiresAt,
      isEmailVerified: false,
      isApprovedByAdmin: false,
      role: dto.role ?? 'student',
      status: dto.status ?? 'active',
    });

    // Send OTP email
    try {
      await this.mailerService.sendOtpEmail(dto.email, otp);
    } catch (error) {
      throw new InternalServerErrorException('User created, but failed to send OTP');
    }

    return user;
  }
}
