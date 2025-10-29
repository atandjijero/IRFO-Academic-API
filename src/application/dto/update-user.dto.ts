import { IsOptional, IsIn, IsString, IsEmail } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: "Prénom de l'utilisateur",
    example: 'Jerome',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    description: "Nom de famille de l'utilisateur",
    example: 'Kouassi',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: "Rôle de l'utilisateur",
    enum: ['admin', 'etudiant', 'surveillant', 'comptabilite'],
    example: 'etudiant',
  })
  @IsOptional()
  @IsIn(['admin', 'etudiant', 'surveillant', 'comptabilite'])
  role?: 'admin' | 'etudiant' | 'surveillant' | 'comptabilite';

  @ApiPropertyOptional({
    description: "Statut du compte utilisateur",
    enum: ['actif', 'inactif', 'bloque'],
    example: 'actif',
  })
  @IsOptional()
  @IsIn(['actif', 'inactif', 'bloque'])
  status?: 'actif' | 'inactif' | 'bloque';
}
