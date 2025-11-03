import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSchoolDto {
  @ApiProperty({
    example: 'IAEC',
    description: "Nom de l'établissement",
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'infos@iaectogo.com',
    description: "Adresse email de l'établissement",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Boulevard de la Kara, Tokoin-Doumassé II, Lomé-Togo',
    description: "Adresse physique de l'établissement",
  })
  @IsString()
  address: string;
}
