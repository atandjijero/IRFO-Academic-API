import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class MessageDto {
  @ApiProperty({ example: 'bonjour à tous' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ example: 'bbf3e354dbe8d1c92b748e8f67338a3f' })
  @IsString()
  @Length(32, 32, { message: 'La clé doit contenir 32 caractères hexadécimaux (16 octets)' })
  @Matches(/^[0-9a-fA-F]+$/, { message: 'La clé doit être en hexadécimal' })
  key: string;

  @ApiProperty({ example: 'e9211923c55ce6d82603098cd21437d2' })
  @IsString()
  @Length(32, 32, { message: 'L’IV doit contenir 32 caractères hexadécimaux (16 octets)' })
  @Matches(/^[0-9a-fA-F]+$/, { message: 'L’IV doit être en hexadécimal' })
  iv: string;
}
