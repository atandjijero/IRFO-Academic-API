import { PartialType } from '@nestjs/mapped-types';
import { CreateSubjectDto } from './create-subject.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {
  @IsOptional()
  @IsString({ message: 'Le nom de la matière doit être une chaîne de caractères' })
  @ApiProperty({
    example: 'Mathématiques',
    description: 'Nom de la matière',
    required: false,
  })
  name?: string;
}
