import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'utilisateur@example.com',
    description: 'Adresse email de l’utilisateur',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Code de réinitialisation reçu par email',
  })
  @IsNotEmpty()
  resetCode: string;

  @ApiProperty({
    example: 'Abc123@.',
    description: 'Nouveau mot de passe sécurisé (8 caractères minimum)',
  })
  @IsNotEmpty()
  @Length(8, 32)
  newPassword: string;

  @ApiProperty({
    example: 'Abc123@.',
    description: 'Confirmation du nouveau mot de passe',
  })
  @IsNotEmpty()
  confirmPassword: string;
}
