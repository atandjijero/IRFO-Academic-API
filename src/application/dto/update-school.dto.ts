import { PartialType } from '@nestjs/mapped-types';
import { CreateSchoolDto } from './create-school.dto';
import { IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSchoolDto extends PartialType(CreateSchoolDto) {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'IAEC',
    description: "Nom de l'école",
    required: false,
  })
  name?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    example: 'infos@iaectogo.com',
    description: "Adresse email de l'école",
    required: false,
  })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Boulevard de la Kara, Tokoin-Doumassé II, Lomé-Togo',
    description: "Adresse physique de l'école",
    required: false,
  })
  address?: string;
}
