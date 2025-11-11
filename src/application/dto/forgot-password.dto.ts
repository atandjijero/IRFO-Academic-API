import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'utilisateur@example.com',
    description: 'Adresse email de l’utilisateur pour réinitialiser le mot de passe',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;ggggggggggggg
}
