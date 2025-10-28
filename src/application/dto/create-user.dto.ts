import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Prénom de l’utilisateur',
    example: 'Jean',
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Nom de famille de l’utilisateur',
    example: 'Dupont',
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Adresse email valide',
    example: 'jean.dupont@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Mot de passe (minimum 6 caractères)',
    example: 'motdepasse123',
  })
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Confirmation du mot de passe',
    example: 'motdepasse123',
  })
  @MinLength(6)
  confirmPassword: string;

  @ApiProperty({
    description: 'Adresse physique de l’utilisateur',
    example: '123 rue de la République, Lomé',
  })
  @IsNotEmpty()
  address: string;
}
