import { IsOptional, IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNoteDto {
  @ApiPropertyOptional({ example: 'Jane Doe', description: 'Nom de l’élève' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  studentName?: string;

  @ApiPropertyOptional({ example: 18.5, description: 'Note obtenue' })
  @IsNumber()
  @IsOptional()
  score?: number;
}
