import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: "Adresse email de l'utilisateur",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'motdepasse123',
    description: "Mot de passe de l'utilisateur (minimum 6 caractères)",
  })
  @IsString()
  @MinLength(6)
  password: string;
}
