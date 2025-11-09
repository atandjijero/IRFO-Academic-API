import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyLoginOtpDto {
  @ApiProperty({
    example: 'jean.dupont@example.com',
    description: "Adresse email de l'utilisateur",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Code OTP reçu par email (6 chiffres)',
  })
  @IsString()
  @Length(6, 6)
  code: string;
}
