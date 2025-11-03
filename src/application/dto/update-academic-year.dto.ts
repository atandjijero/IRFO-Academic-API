import { PartialType } from '@nestjs/mapped-types';
import { CreateAcademicYearDto } from './create-academic-year.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAcademicYearDto extends PartialType(CreateAcademicYearDto) {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '2025-2026',
    description: "Libellé de l'année académique",
    required: false,
  })
  label?: string;
}
