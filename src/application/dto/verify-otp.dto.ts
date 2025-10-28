import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'Adresse email de l’utilisateur à vérifier' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'Code OTP reçu par email' })
  @IsString()
  code: string;
}
