import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubjectDto {
  @ApiProperty({
    example: 'Mathematics',
    description: 'Nom de la matière',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Cours de base couvrant l’algèbre, la géométrie et les statistiques.',
    description: 'Description de la matière',
  })
  @IsString()
  description: string;
}
