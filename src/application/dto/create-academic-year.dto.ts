import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAcademicYearDto {
  @ApiProperty({
    example: '2025-2026',
    description: "Libellé de l'année scolaire (ex. : 2025-2026)",
  })
  @IsString()
  label: string;
}
