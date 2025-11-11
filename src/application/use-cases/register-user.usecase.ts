import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(dto: CreateUserDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepo.createUser({
      ...dto,
      password: hashedPassword,
      isEmailVerified: true, // Email vérifié par défaut
      isApprovedByAdmin: false,
      role: dto.role ?? 'student',
      status: dto.status ?? 'active',
    });

    return user;
  }
}
